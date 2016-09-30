import '../common/Polyfills';
import React, { Component } from 'react';
import update from 'react/lib/update';
import { shouldComponentUpdate } from 'react/lib/ReactComponentWithPureRenderMixin';
import ReactDOM from 'react-dom';
import md5 from 'md5';

import OrderQuery from './components/OrderQuery';
import OrderList from './components/OrderList';
import * as ServerApi from '../common/units/ServerApi';

class IssuePage extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = shouldComponentUpdate.bind(this);

    this.store = {
      entities: {
        orders: {}
      },
      issue: {
        orderList: []
      }
    };
    this.state = this.store;
  }

  componentDidMount() {

  }

  doGetIssueOrders(username, start_date, end_date) {
    return ServerApi.Order.getIssueOrders(username, start_date, end_date).then(data => {
      let {orders, orderList} = data;

      //计算chksum
      for (var order_id in orders) {
        let order = orders[order_id];
        order.chksum = md5(JSON.stringify(order)).substr(0,6);
      }

      this.store = update(this.store, {
        entities: {
          orders: {$merge: orders}
        },
        orderList: {$set: orderList}
      });
      this.setState(this.store);

      return data;
    });
  }
  
  doIssueOrder(order_id, callback) {
    return ServerApi.Order.issueOrder(order_id).then(data => {
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
        <OrderQuery ref="query" onQeury={this.doGetIssueOrders.bind(this)} onFilter={this.onFilter.bind(this)} />
        <hr />
        <OrderList ref="list" orders={orders} orderList={orderList} doIssueOrder={this.doIssueOrder.bind(this)}/>
      </div>
    );
  }
}
ReactDOM.render(
  <IssuePage />,
  document.getElementById('issue-page')
);