import React, { Component } from 'react';
import { shouldComponentUpdate } from 'react/lib/ReactComponentWithPureRenderMixin';

import Item from './LockItem';
import Pagination from '../../common/components/Pagination';
import { getAbstractStatus } from '../../common/units/Helpers';
import { STATUS } from '../../common/constants/OrderStatus';

class LockList extends Component {
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
    this.setState({filter});
  }

  getFilteredList() {
    let { locks, lockList } = this.props;
    let filter = this.state.filter;
    let _lockList = [];
    for (var index in lockList) {
      let lock_id = lockList[index];
      let lock = locks[lock_id];
      
      if(filter.status && filter.status != 0 && filter.status != order.status){
        continue;
      }
      _lockList.push(lock_id);
    }
    return _lockList;
  }

  render() {
    let { rooms, locks } = this.props;
    let { curPage, perPage } = this.state.filter;

    let lockList = this.getFilteredList();
    let { start, end } = Pagination.getLimit(curPage, lockList.length, perPage);

    return (
      <div>
      {
        lockList.slice(start, end).map(lock_id => {
          let lock = locks[lock_id];
          return (
            <Item key={lock_id} rooms={rooms} lock={lock} chksum={lock.chksum} onOperationClick={this.props.onOperationClick} />
          );
        })
      }
      <Pagination ref="page" length={5} total={lockList.length} per={perPage} cur={curPage} onPageClick={this.onPageClick.bind(this)}/>
      </div>
    );
  }
}
export default LockList;