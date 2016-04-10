import '../common/Polyfills';
import React, { Component } from 'react';
import { shouldComponentUpdate } from 'react/lib/ReactComponentWithPureRenderMixin';
import ReactDOM from 'react-dom';
import md5 from 'md5';

import OrderQuery from './components/OrderQuery';
import OrderList from './components/OrderList';
import { ajaxGet } from '../common/units/AjaxApi';

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
    this.state = Object.assign({}, this.store);
  }

  componentDidMount() {
    this.refs.query.onQeury();
  }

  doGetMyOrders(start_date, end_date, callback) {
    ajaxGet('/order/getmyorders?start_date='+start_date+'&end_date='+end_date, (success, data) => {
      if (success) {
        let {orders, orderList} = data;

        //计算chksum
        for (var order_id in orders) {
          let order = orders[order_id];
          order.chksum = md5(JSON.stringify(order)).substr(0,6);
        }

        this.store.entities = Object.assign({}, this.store.entities, { 
          orders: Object.assign({}, this.store.entities.orders, orders)
        });
        this.store.myorder = Object.assign({}, this.store.myorder, {
          orderList: orderList
        });
        this.setState(this.store);
      }
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
    let { orderList } = this.state.myorder;
    return (
      <div>
        <OrderQuery ref="query" onQeury={this.doGetMyOrders.bind(this)} onFilter={this.onFilter.bind(this)} />
        <hr />
        <OrderList ref="list" orders={orders} orderList={orderList} />
      </div>
    );
  }
}
ReactDOM.render(
  <MyorderPage />,
  document.getElementById('myorder-page')
);