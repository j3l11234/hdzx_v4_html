import React, { Component } from 'react';
import { shouldComponentUpdate } from 'react/lib/ReactComponentWithPureRenderMixin';

import Item from './OrderItem';
import Pagination from '../../common/components/Pagination';
import { getAbstractStatus } from '../../common/units/Helpers';
import { STATUS } from '../../common/constants/OrderStatus';

class OrderList extends Component {
  constructor (props) {
    super(props);
    this.shouldComponentUpdate = shouldComponentUpdate.bind(this);

    this.state = {
      filter: {
        perPage: 8,
        curPage: 1
      }
    };
  }
  
  setFilter(filter) {
    this.setState({
      filter
    });
  }

  getFilteredList() {
    let { orders, orderList } = this.props;
    let filter = this.state.filter;
    let _orderList = [];
    for (var index in orderList) {
      let order_id = orderList[index];
      let order = orders[order_id];
      
      let status = getAbstractStatus(order.status);
      if (filter.status) {
        if ((filter.status == STATUS.STATUS_PENDING && status != STATUS.STATUS_PENDING) ||
          (filter.status == STATUS.STATUS_APPROVED && status != STATUS.STATUS_APPROVED) ||
          (filter.status == STATUS.STATUS_REJECTED && status != STATUS.STATUS_REJECTED)){
          continue;
        }
      }
      if(filter.dept_id && orders.dept_id != 0 && filter.dept_id != orders.dept_id){
        continue;
      }

      _orderList.push(order_id);
    }
    return _orderList;
  }

  onPageClick(page) {
    this.setFilter(Object.assign({}, this.state.filter, { 
      curPage: page
    }));
  }

  render() {
    let { orders, onCancelClick, onPaperClick } = this.props;
    let { curPage, perPage } = this.state.filter;
    let orderList = this.getFilteredList();
    let { start, end } = Pagination.getLimit(curPage, orderList.length, perPage);

    return (
      <div>
      {
        orderList.slice(start, end).map(orderId => {
          let order = orders[orderId];
          return (
            <Item key={orderId} order={order} chksum={order.chksum}
              onCancelClick={onCancelClick} onPaperClick={onPaperClick} />
          );
        })
      }
      <Pagination ref="page" length={5} total={orderList.length} per={perPage} cur={curPage}
       onPageClick={this.onPageClick.bind(this)} />
      </div>
    );
  }
}
export default OrderList;