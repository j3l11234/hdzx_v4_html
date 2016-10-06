import '../common/Polyfills';
import React, { Component } from 'react';
import update from 'react/lib/update';
import { shouldComponentUpdate } from 'react/lib/ReactComponentWithPureRenderMixin';
import ReactDOM from 'react-dom';
import md5 from 'md5';

import OrderQuery from './components/OrderQuery';
import OrderList from './components/OrderList';
import OrderExtModal from './components/OrderExtModal';
import * as ServerApi from '../common/units/ServerApi';

class MyorderPage extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = shouldComponentUpdate.bind(this);

    this.store = {
      entities: {
        orders: {}
      },
      myorder: {
        orderList: []
      }
    };
    this.state = this.store;
  }

  componentDidMount() {
    this.refs.query.onQeury();
  }

  doGetMyOrders(start_date, end_date) {
    return ServerApi.Order.getMyOrders(start_date, end_date).then(data => {
      let {orders, orderList} = data;

      //计算chksum
      for (var order_id in orders) {
        let order = orders[order_id];
        order.chksum = md5(JSON.stringify(order)).substr(0,6);
      }

      this.store = update(this.store, {
        entities: {
          orders: {$merge: orders},
        },
        orderList: {$set: orderList},
      });
      this.setState(this.store);

      return data;
    });
  }
  
  doCancelOrder(order_id) {
    return ServerApi.Order.cancelOrder(order_id).then(data => {
      this.refs.query.onQeury();
      return data;
    });
  }

  doPaperOrder(order_id) {
    return ServerApi.Order.paperOrder(order_id).then(data => {
      let { expire, url } = data;

      let order = update(this.store.entities.orders[order_id], {
        apply: {$set: {
          expire,
          url,
        }}
      });
      order.chksum = md5(JSON.stringify(order)).substr(0,6);
      this.store = update(this.store, {
        entities: {
          orders: {
            [order_id]: {$set: order}
          },
        },
      });
      this.setState(this.store);
      return data;
    });
  }

  doUpdateOrderExt(order_id, data) {
    return ServerApi.Order.updateOrderExt(order_id, data).then(data => {
      this.refs.query.onQeury();
      return data;
    });
  }

  onExtClick(order_id) {
     this.store = update(this.store, {
      myorder: {
        order_id: {$set: order_id},
      }
    });
    this.setState(this.store);
    this.refs.modal.showModal();
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
    let { orderList } = this.state;
    let { order_id } = this.state.myorder;
    let order = orders[order_id];

    return (
      <div>
        <OrderQuery ref="query" onQeury={this.doGetMyOrders.bind(this)} onFilter={this.onFilter.bind(this)} />
        <hr />
        <OrderList ref="list" orders={orders} orderList={orderList}
          onCancelClick={this.doCancelOrder.bind(this)} onPaperClick={this.doPaperOrder.bind(this)} onExtClick={this.onExtClick.bind(this)}/>
        <OrderExtModal ref="modal" order={order} onSubmit={this.doUpdateOrderExt.bind(this)} />
      </div>
    );
  }
}
ReactDOM.render(
  <MyorderPage />,
  document.getElementById('myorder-page')
);