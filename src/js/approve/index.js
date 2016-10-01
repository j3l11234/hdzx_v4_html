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
        orders: {}
      },
      approve: {
      },
      orderList: [],
    };
    this.state = this.store;
  }

  componentWillMount() {
  }

  componentDidMount() {
    this.refs.query.onQeury();
    this.refs.query.onFilterClick();
  }

  doGetApproveOrders(start_date, end_date) {
    return ServerApi.Approve.getOrders(this.props.type, start_date, end_date).then(respData => {
      let { orders, orderList, roomTables } = respData;

      //计算chksum，分析冲突预约
      for (var order_id in orders) {
        let order = orders[order_id];
        let roomTable = roomTables[order.date+'_'+order.room_id];
        order.conflict = [];

        if (roomTable) {
          let conflictOrders = getListFormTable(roomTable.ordered, order.hours).concat(
            getListFormTable(roomTable.used, order.hours));
          conflictOrders.forEach(conflict_order_id => {
            if (orders[conflict_order_id] && conflict_order_id != order_id) {
              order.conflict.push(conflict_order_id);
            }
          }); 
        }
        order.chksum = md5(JSON.stringify(order)).substr(0,6);
      }
      this.store = update(this.store, {
        entities: {
          orders: {$merge: orders},
        },
        orderList: {$set: orderList},
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

  onConflictClick(order_id){
    this.refs.list.setConflict(order_id);
  }

  doOperateOrder(operation, data) {
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
    return operateFn(this.props.type, data).then(respData => {
      this.refs.query.onQeury();
      return respData;
    });
  }

  onFilter(status, perPage) {
    this.refs.list.setFilter({
      status,
      perPage,
      curPage: 1
    });
  }

  render() {
    let { orderList } = this.state;
    let { orders } = this.state.entities;
    let { order_id, operation } = this.state.approve;  
    let { type } = this.props;
    let order = orders[order_id];

    return (
      <div>
        <Query ref="query" type={type} onQeury={this.doGetApproveOrders.bind(this)} onFilter={this.onFilter.bind(this)} />
        <hr />
        <List ref="list" type={type} orders={orders} orderList={orderList}
         onOperationClick={this.onOperationClick.bind(this)} onConflictClick={this.onConflictClick.bind(this)}/>
        <Modal ref="modal" type={type} order={order} operation={operation} onSubmit={this.doOperateOrder.bind(this)} />
      </div>
    );
  }
}
ReactDOM.render(
  <ApprovePage type={_Server_Data_.apprveType} />,
  document.getElementById('approve-page')
);