import '../common/Polyfills';
import React, { Component } from 'react';
import { shouldComponentUpdate } from 'react/lib/ReactComponentWithPureRenderMixin';
import ReactDOM from 'react-dom';
import md5 from 'md5';

import Query from './components/ApproveQuery';
import List from './components/ApproveOrderList';
import Modal from './components/ApproveModal';
import { ajaxGet, ajaxPost } from '../common/units/AjaxApi';
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
        orderList: []
      }
    };
    this.state = Object.assign({}, this.store);
  }

  componentWillMount() {
  }

  componentDidMount() {
    this.refs.query.onQeury();
    this.refs.query.onFilterClick();
  }

  doGetMyOrders(start_date, end_date, callback) {
    ajaxGet('/approve/getorders?type='+this.props.type+'&start_date='+start_date+'&end_date='+end_date, (success, data) => {
      if (success) {
        let {orders, orderList, roomTables} = data;

        //计算chksum，分析冲突预约
        for (var order_id in orders) {
          let order = orders[order_id];
          let roomTable = roomTables[order.room_id][order.date];

          let parallelOrders = getListFormTable(roomTable.ordered, order.hours).concat(getListFormTable(roomTable.used, order.hours));
          order.conflict = [];
          for(var i in parallelOrders) {
            let order_id_ = parallelOrders[i];
            if (!orders[order_id_] || order_id_ == order_id) {
              continue;
            }
            order.conflict.push(order_id_);
          }
          order.chksum = md5(JSON.stringify(order)).substr(0,6);
        }

        this.store.entities = Object.assign({}, this.store.entities, { 
          orders: Object.assign({}, this.store.entities.orders, orders)
        });
        this.store.approve = Object.assign({}, this.store.approve, {
          orderList: orderList
        });
        this.setState(this.store);
      }
      callback && callback(success, data); 
    });
  }
  
  onOperationClick(order_id, operation) {
    this.store.approve = Object.assign({}, this.store.approve, {
      order_id: order_id,
      operation: operation
    }); 
    this.setState(this.store);
    this.refs.modal.showModal();
  }

  doOperateOrder(operation, data, callback) {
    let url;
    switch(operation) {
      case 'approve':
        url = '/approve/approveorder?type='+this.props.type;
        break;
      case 'reject':
        url = '/approve/rejectorder?type='+this.props.type;
        break;
      case 'revoke':
        url = '/approve/revokeorder?type='+this.props.type;
        break;
      default:
        return;
    }
    ajaxPost(url, data, (success, data) => {
      callback && callback(success, data); 
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
    let { orders } = this.state.entities;
    let { orderList, order_id, operation } = this.state.approve;
    let { type } = this.props;
    let order = orders[order_id];
    return (
      <div>
        <Query ref="query" type={type} onQeury={this.doGetMyOrders.bind(this)} onFilter={this.onFilter.bind(this)} />
        <hr />
        <List ref="list" type={type} orders={orders} orderList={orderList} onOperationClick={this.onOperationClick.bind(this)}/>
        <Modal ref="modal" order={order} operation={operation} onSubmit={this.doOperateOrder.bind(this)} />
      </div>
    );
  }
}
ReactDOM.render(
  <ApprovePage type={_Server_Data_.apprveType} />,
  document.getElementById('approve-page')
);