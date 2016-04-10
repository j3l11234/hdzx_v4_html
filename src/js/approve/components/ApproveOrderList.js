import React, { Component } from 'react';
import { shouldComponentUpdate } from 'react/lib/ReactComponentWithPureRenderMixin';

import Item from './ApproveOrderItem';

class OrderList extends Component {
  constructor (props) {
    super(props);
    this.shouldComponentUpdate = shouldComponentUpdate.bind(this);

    this.state = {
      filter: {}
    };
  }
  
  render() {
    let { orders, orderList, type } = this.props;

    return (
      <div>
      {
        orderList && orderList.map(orderId => {
          let order = orders[orderId];
          return (
            <Item key={orderId} type={type} order={order} chksum={order.chksum} onOperationClick={this.props.onOperationClick} />
          );
        })
      }
      </div>
    );
  }
}
export default OrderList;