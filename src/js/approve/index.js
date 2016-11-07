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
        type: this.props.type,
      },
      deptMap:[],
      roomList:[],
      orderList: [],
    };
    this.state = this.store;

    this.actions = {
      onQeury: this.onQeury.bind(this),
      onOperationClick: this.onOperationClick.bind(this),
      doOperateOrder: this.doOperateOrder.bind(this),
      onFilter: this.onFilter.bind(this),
      onSetConflict: this.onSetConflict.bind(this),
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
    this.refs.query.onFilterClick();
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
    });
    this.setState(this.store);
    return this.doGetApproveOrders();
  }

  doGetApproveOrders() {
    return ServerApi.Approve.getOrders(this.store.search).then(respData => {
      let { orders, orderList, roomTables, start_date, end_date } = respData;

      //计算chksum，分析冲突预约
      for (var order_id in orders) {
        let order = orders[order_id];
        order.chksum = md5(JSON.stringify(order)).substr(0,6);
      }
      this.store = update(this.store, {
        entities: {
          orders: {$merge: orders},
        },
        orderList: {$set: orderList},
        search: {
          start_date: {$set: start_date},
          end_date: {$set: end_date},
        },
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

  onFilter(status, perPage) {
    this.refs.list.setFilter({
      status,
      perPage,
      curPage: 1
    });
  }

  render() {
    let {orderList, roomList, deptMap, search:{conflict_id}, entities: {depts, orders, rooms}, approve: {order_id, operation}} = this.state;
    let {type} = this.props;
    let { onQeury, onOperationClick, doOperateOrder, onFilter, onSetConflict} = this.actions;
    let order = orders[order_id];

    return (
      <div>
        <Query ref="query" type={type} roomList={roomList} rooms={rooms} deptMap={deptMap} depts={depts}
          onQeury={onQeury} onFilter={onFilter} />
        <hr />
        <List ref="list" type={type} orders={orders} orderList={orderList} conflict_id={conflict_id}
         onOperationClick={onOperationClick} onSetConflict={onSetConflict} />
        }
        <Modal ref="modal" type={type} order={order} operation={operation} onSubmit={doOperateOrder} />
      </div>
    );
  }
}

ReactDOM.render(
  <ApprovePage type={_Server_Data_.apprveType} />,
  document.getElementById('approve-page')
);