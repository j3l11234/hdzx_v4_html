import React, { Component } from 'react';
import { shouldComponentUpdate } from 'react/lib/ReactComponentWithPureRenderMixin';

import Item from './ApproveOrderItem';
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

  onPageClick(page) {
    this.setFilter(Object.assign({}, this.state.filter, { 
      curPage: page
    }));
  }

  setFilter(filter) {
    this.setState({
      filter
    });
  }

  getFilteredList() {
    let { orders, orderList, type } = this.props;
    let filter = this.state.filter;
    let _orderList = [];
    for (var index in orderList) {
      let order_id = orderList[index];
      let order = orders[order_id];
      
      let status = getAbstractStatus(order.status, type);
      if (filter.status) {
        if ((filter.status == STATUS.STATUS_PENDING && status != STATUS.STATUS_PENDING) ||
          (filter.status == STATUS.STATUS_APPROVED && status != STATUS.STATUS_APPROVED && status != STATUS.STATUS_APPROVED_FIXED) ||
          (filter.status == STATUS.STATUS_REJECTED && status != STATUS.STATUS_REJECTED && status != STATUS.STATUS_REJECTED_FIXED)){
          continue;
        }
      }  
      if(filter.dept_id && filter.dept_id != 0 && filter.dept_id != order.dept_id){
        continue;
      }
      _orderList.push(order_id);
    }
    return _orderList;
  }

  render() {
    let { orders, type } = this.props;
    let { curPage, perPage } = this.state.filter;

    let orderList = this.getFilteredList();
    let { start, end } = Pagination.getLimit(curPage, orderList.length, perPage);

    return (
      <div>
      {
        orderList.slice(start, end).map(order_id => {
          let order = orders[order_id];
          return (
            <Item key={order_id} type={type} order={order} chksum={order.chksum} onOperationClick={this.props.onOperationClick} />
          );
        })
      }
      <Pagination ref="page" length={5} total={orderList.length} per={perPage} cur={curPage} onPageClick={this.onPageClick.bind(this)}/>
      </div>
    );
  }
}
export default OrderList;