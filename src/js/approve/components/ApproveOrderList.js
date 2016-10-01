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
    let { filter, conflict_id} = this.state;

    if (conflict_id != -1 && orders[conflict_id]) { //显示冲突预约
      orderList = [conflict_id].concat(orders[conflict_id].conflict);
    } else { //筛选
      let _orderList = [];  //filted orderList
      orderList.forEach(order_id => {
        let order = orders[order_id];
        if (!order) {
          return;
        }
        let status = getAbstractStatus(order.status, type);
        if (filter.status) {
          if (filter.status == STATUS.STATUS_PENDING) {
            if (status === STATUS.STATUS_PENDING) {
              _orderList.push(order_id);
            }
          } else if (filter.status == STATUS.STATUS_APPROVED) {
            if (status === STATUS.STATUS_APPROVED || status === STATUS.STATUS_APPROVED_FIXED) {
              _orderList.push(order_id);
            }
          } else if (filter.status == STATUS.STATUS_REJECTED) {
            if (status === STATUS.STATUS_REJECTED || status === STATUS.STATUS_REJECTED_FIXED) {
              _orderList.push(order_id);
            }
          }
        } 
      });
      orderList = _orderList;
    }
    
    return orderList;
  }

  render() {
    let { orders, type, onOperationClick, onConflictClick } = this.props;
    let { curPage, perPage } = this.state.filter;

    let orderList = this.getFilteredList();
    let { start, end } = Pagination.getLimit(curPage, orderList.length, perPage);

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