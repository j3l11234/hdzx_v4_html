import React, { Component } from 'react';
import { shouldComponentUpdate } from 'react/lib/ReactComponentWithPureRenderMixin';
import update from 'react/lib/update';

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
        curPage: 1,
        conflict_id: -1,
      },  
    };
  }

  onPageClick(page) {
    this.setFilter({curPage: page});
  }

  onConflictClick(order_id) {
    this.setFilter({
      conflict_id: order_id,
      curPage: 1
    });
  }

  setFilter(filter) {
    this.setState(state => {
      state = update(state, {
        filter: {$merge: filter}
      });
      return state;
    });
  }


  getFilteredList() {
    let { orders, orderList, type } = this.props;
    let { filter, filter:{conflict_id},} = this.state;

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
    let { orders, type, onOperationClick } = this.props;
    let { curPage, perPage } = this.state.filter;

    let orderList = this.getFilteredList();
    let { start, end } = Pagination.getLimit(curPage, orderList.length, perPage);

    return (
      <div>
      { 
        this.state.filter.conflict_id != -1 ? 
        <button type="button" className="btn-block btn btn-success" onClick={this.onConflictClick.bind(this,-1)}>显示所有申请</button> : null
      }
      <br />
      {
        orderList.slice(start, end).map(order_id => {
          let order = orders[order_id];
          return (
            <Item key={order_id} type={type} order={order} chksum={order.chksum} 
              onOperationClick={onOperationClick} onConflictClick={this.onConflictClick.bind(this)}/>
          );
        })
      }
      <Pagination ref="page" length={5} total={orderList.length} per={perPage} cur={curPage} onPageClick={this.onPageClick.bind(this)}/>
      </div>
    );
  }
}
export default OrderList;