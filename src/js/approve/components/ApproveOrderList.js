import React, { Component } from 'react';
import { shouldComponentUpdate } from 'react/lib/ReactComponentWithPureRenderMixin';

import Item from './ApproveOrderItem';
import Pagination from '../../common/components/Pagination';
import { getAbsStatus } from '../../common/units/Helpers';
import { STATUS } from '../../common/constants/OrderStatus';

class OrderList extends Component {
  constructor (props) {
    super(props);
    this.shouldComponentUpdate = shouldComponentUpdate.bind(this);

    this.state = {
      filter: {
        perPage: 8,
        curPage: 1
      },
      conflict_id: -1,
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

  setConflict(order_id) {
    this.setState({
      conflict_id: order_id,
    });
  }

  getFilteredList() {
    let { orders, orderList, type } = this.props;
    let {filter, conflict_id} = this.state;
    console.log(conflict_id,orders[conflict_id]);
    if(conflict_id != -1 && orders[conflict_id]){
      orderList = [conflict_id].concat(orders[conflict_id].conflict);
    }

    let _orderList = [];
    for (var index in orderList) {
      let order_id = orderList[index];
      let order = orders[order_id];
      
      if (!order){
        continue;
      }

      let status = getAbsStatus(order.status, type);
      if (filter.status) {
        if ((filter.status == STATUS.STATUS_PENDING && status != STATUS.STATUS_PENDING) ||
          (filter.status == STATUS.STATUS_APPROVED && status != STATUS.STATUS_APPROVED && status != STATUS.STATUS_APPROVED_FIXED) ||
          (filter.status == STATUS.STATUS_REJECTED && status != STATUS.STATUS_REJECTED && status != STATUS.STATUS_REJECTED_FIXED)){
          continue;
        }
      }
      _orderList.push(order_id);
    }
    return _orderList;
  }

  render() {
    let { orders, type, onOperationClick, onConflictClick } = this.props;
    let { curPage, perPage } = this.state.filter;

    let orderList = this.getFilteredList();
    let { start, end } = Pagination.getLimit(curPage, orderList.length, perPage);
    console.log(orderList);
    return (
      <div>
      { 
        this.state.conflict_id != -1 ? 
        <button type="button" className="btn-block btn btn-success" onClick={this.setConflict.bind(this,-1)}>显示所有申请</button> : null
      }
      <br />
      {
        orderList.slice(start, end).map(order_id => {
          let order = orders[order_id];
          return (
            <Item key={order_id} type={type} order={order} chksum={order.chksum} 
            onOperationClick={onOperationClick} onConflictClick={onConflictClick}/>
          );
        })
      }
      <Pagination ref="page" length={5} total={orderList.length} per={perPage} cur={curPage} onPageClick={this.onPageClick.bind(this)}/>
      </div>
    );
  }
}
export default OrderList;