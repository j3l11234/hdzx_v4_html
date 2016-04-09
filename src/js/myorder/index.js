import '../common/Polyfills';
import React, { Component } from 'react';
import { shouldComponentUpdate } from 'react/lib/ReactComponentWithPureRenderMixin';
import ReactDOM from 'react-dom';

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
        this.store.entities = Object.assign({}, this.store.entities, { 
          orders: Object.assign({}, this.store.entities.orders, orders)
        });
        this.store.myorder = Object.assign({}, this.store.myorder, {
          orderList: orderList
        });
        this.setState({
          entities: this.store.entities,
          myorder: this.store.myorder
        });
      }
      callback && callback(success, data); 
    });
  }
  

  render() {
    let { orders } = this.state.entities;
    let { orderList } = this.state.myorder;
    return (
      <div>
        <OrderQuery ref="query" onQeury={this.doGetMyOrders.bind(this)} />
        <hr />
        <OrderList orders={orders} orderList={orderList} />
      </div>
    );
  }
}
ReactDOM.render(
  <MyorderPage />,
  document.getElementById('myorder-page')
);