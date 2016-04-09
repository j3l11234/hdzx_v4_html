import React, { Component } from 'react';
import { shouldComponentUpdate } from 'react/lib/ReactComponentWithPureRenderMixin';

import Item from './OrderItem';

class OrderList extends Component {
  constructor (props) {
    super(props);
    this.shouldComponentUpdate = shouldComponentUpdate.bind(this);
  }
  
  render() {
    let { orders, orderList } = this.props;

    return (
      <div>
      {
        orderList && orderList.map(orderId => {
          let order = orders[orderId];
          return (
            <Item key={orderId} order={order} chksum={order.chksum} />
          );
        })
      }
      </div>
    );
  }
}
export default OrderList;