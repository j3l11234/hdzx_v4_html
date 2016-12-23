import React, { Component } from 'react';
import { shouldComponentUpdate } from 'react/lib/ReactComponentWithPureRenderMixin';
import update from 'react/lib/update';

import Item from './ApproveOrderItem';
import Pagination from '../../common/components/Pagination';
import { getOrderAbsStatus } from '../../common/units/Helpers';
import { STATUS } from '../../common/constants/Order';

class OrderList extends Component {
  constructor (props) {
    super(props);
    this.shouldComponentUpdate = shouldComponentUpdate.bind(this);

    this.state = { 
    };
  }

  render() {
    let {type, orders, orderList, conflict_id, page:{cur_page, per_page, total}, 
      onOperationClick, onSetConflict, onPageClick} = this.props;

    return (
      <div>
      { 
        conflict_id ? 
        [<button key='btn' type="button" className="btn-block btn btn-success" onClick={onSetConflict.bind(this, null)}>显示所有申请</button>,<br key='br' />] : null
      }
      {
        orderList.map(order_id => {
          let order = orders[order_id];
          return (
            <Item key={order_id} type={type} order={order} chksum={order.chksum} 
              onOperationClick={onOperationClick} onConflictClick={onSetConflict}/>
          );
        })
      }
      <Pagination ref="page" length={5} total={total} per={per_page} cur={cur_page} onPageClick={onPageClick}/>
      </div>
    );
  }
}
export default OrderList;