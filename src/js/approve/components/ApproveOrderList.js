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

  render() {
    let { type, orders, orderList, conflict_id, onOperationClick, onSetConflict } = this.props;
    let { curPage, perPage } = this.state.filter;

    let { start, end } = Pagination.getLimit(curPage, orderList.length, perPage);

    return (
      <div>
      { 
        conflict_id ? 
        <button type="button" className="btn-block btn btn-success" onClick={onSetConflict.bind(this, null)}>显示所有申请</button> : null
      }
      <br />
      {
        orderList.slice(start, end).map(order_id => {
          let order = orders[order_id];
          return (
            <Item key={order_id} type={type} order={order} chksum={order.chksum} 
              onOperationClick={onOperationClick} onConflictClick={onSetConflict}/>
          );
        })
      }
      <Pagination ref="page" length={5} total={orderList.length} per={perPage} cur={curPage} onPageClick={this.onPageClick.bind(this)}/>
      </div>
    );
  }
}
export default OrderList;