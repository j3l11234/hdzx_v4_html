import '../common/Polyfills';
import React, { Component } from 'react';
import { shouldComponentUpdate } from 'react/lib/ReactComponentWithPureRenderMixin';
import update from 'react/lib/update';
import ReactDOM from 'react-dom';
import md5 from 'md5';

import Query from './components/ApproveQuery';
import List from './components/ApproveOrderList';
import Modal from './components/ApproveModal';
import * as ServerApi from '../common/units/ServerApi';
import { getListFormTable } from '../common/units/Helpers';


class ApprovePage extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = shouldComponentUpdate.bind(this);

    this.store = {
      entities: {
        orders: {},
        rooms: {},
        depts: {}
      },
      approve: {
        order_id: null,
        operation: null,
      },
      search: {
      },
      deptMap:[],
      roomList:[],
      orderList: [],
      page:{}
    };
    this.state = this.store;

    this.actions = {
      onQeury: this.onQeury.bind(this),
      onOperationClick: this.onOperationClick.bind(this),
      doOperateOrder: this.doOperateOrder.bind(this),
      onSetConflict: this.onSetConflict.bind(this),
      onPageClick: this.onPageClick.bind(this),
    }
  }

  componentWillMount() {
    ServerApi.Data.getMetaData({room:1, dept:1}).then(data => {
      let { room, dept } = data;
      this.store = update(this.store, {
        entities: {
          rooms: {$merge: room.rooms},
          depts: {$merge: dept.depts}
        },
        roomList: {$set: room.roomList},
        deptMap: {$set: dept.deptMap},
      });
      this.setState(this.store);
      return data;
    });
  }

  componentDidMount() {
    this.refs.query.onQeury();
  }

  onQeury(condition) {
    this.store = update(this.store, {
      search: {
        start_date: {$set: condition.start_date},
        end_date: {$set: condition.end_date},
        room_id: {$set: condition.room_id},
        status: {$set: condition.status},
        dept_id: {$set: condition.dept_id},
      },
      page: {
        per_page: {$set: condition.per_page}
      }
    });
    this.setState(this.store);
    return this.doGetApproveOrders();
  }

  doGetApproveOrders() {
    let getOrders;
    if (!this.store.search.conflict_id) {
      getOrders = ServerApi.Approve.getOrders(this.props.type, this.store.search, this.store.page);
    } else {
      getOrders = ServerApi.Approve.getConflictOrders(this.props.type, this.store.search.conflict_id, this.store.page);
    }
    return getOrders.then(respData => {
      let { orders, orderList, _page} = respData;

      //计算chksum，分析冲突预约
      for (var order_id in orders) {
        let order = orders[order_id];
        order.chksum = md5(JSON.stringify(order)).substr(0,6);
      }
      this.store = update(this.store, {
        entities: {
          orders: {$apply: old_orders => {
            //保存上次操作的order信息，防止显示错误
            let lastOrder_id = this.store.approve.order_id;
            if(lastOrder_id && !orders[lastOrder_id] && old_orders[lastOrder_id]){
              orders[lastOrder_id] = old_orders[lastOrder_id];
            }
            return orders;
          }},
        },
        orderList: {$set: orderList},
        page: {$set: _page}
      });
      this.setState(this.store);

      return respData;
    });
  }

  onOperationClick(order_id, operation) {
    this.store = update(this.store, {
      approve: {
        order_id: {$set: order_id},
        operation: {$set: operation}
      }
    });
    this.setState(this.store);
    this.refs.modal.showModal();
  }

  doOperateOrder(operation, order_id, data) {
    let url;
    let operateFn;
    switch(operation) {
      case 'approve':
        operateFn = ServerApi.Approve.approveOrder;
        break;
      case 'reject':
        operateFn = ServerApi.Approve.rejectOrder;
        break;
      case 'revoke':
        operateFn = ServerApi.Approve.revokeOrder;
        break;
      default:
        return;
    }
    return operateFn(this.props.type, order_id, data).then(respData => {
      this.refs.query.onQeury();
      return respData;
    });
  }

  onSetConflict(conflict_id){
    this.store = update(this.store, {
      search: {
        conflict_id: {$set: conflict_id},
      },
    });
    this.setState(this.store);
    return this.doGetApproveOrders();
  }

  onPageClick(page) {
    this.store = update(this.store, {
      page: {
        cur_page: {$set: page},
      },
    });
    this.setState(this.store);
    return this.doGetApproveOrders();
  }

  render() {
    let {orderList, roomList, page, deptMap, search:{conflict_id}, entities: {depts, orders, rooms}, approve: {order_id, operation}} = this.state;
    let {type} = this.props;
    let { onQeury, onOperationClick, doOperateOrder, onSetConflict, onPageClick} = this.actions;
    let order = orders[order_id];

    return (
      <div>
        <Query ref="query" type={type} roomList={roomList} rooms={rooms} deptMap={deptMap} depts={depts}
          onQeury={onQeury} />
        <hr />
        <List ref="list" type={type} orders={orders} orderList={orderList} page={page} conflict_id={conflict_id}
         onOperationClick={onOperationClick} onSetConflict={onSetConflict} onPageClick={onPageClick} />
        <Modal ref="modal" type={type} order={order} operation={operation} onSubmit={doOperateOrder} />
      </div>
    );
  }
}

ReactDOM.render(
  <ApprovePage type={_Server_Data_.apprveType} />,
  document.getElementById('approve-page')
);