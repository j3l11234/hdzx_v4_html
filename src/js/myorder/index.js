import '../common/Polyfills';
import React, { Component } from 'react';
import update from 'react/lib/update';
import { shouldComponentUpdate } from 'react/lib/ReactComponentWithPureRenderMixin';
import ReactDOM from 'react-dom';
import md5 from 'md5';

import OrderQuery from './components/OrderQuery';
import OrderList from './components/OrderList';
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
    return (
      <div>
        <OrderQuery ref="query" onQeury={this.doGetMyOrders.bind(this)} onFilter={this.onFilter.bind(this)} />
        <hr />
        <OrderList ref="list" orders={orders} orderList={orderList} onCancelClick={this.doCancelOrder.bind(this)}/>
      </div>
    );
  }
}
ReactDOM.render(
  <MyorderPage />,
  document.getElementById('myorder-page')
);