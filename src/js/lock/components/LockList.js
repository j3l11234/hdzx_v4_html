import React, { Component } from 'react';
import { shouldComponentUpdate } from 'react/lib/ReactComponentWithPureRenderMixin';

import Item from './LockItem';
import Pagination from '../../common/components/Pagination';

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
      
      if(filter.status && filter.status != 0 && filter.status != lock.status){
        continue;
      }
      if(filter.room_id && filter.room_id != 0 && lock.rooms.indexOf(filter.room_id) == -1){
        continue;
      }
      if(filter.start_date && Date.parse(filter.start_date) > Date.parse(lock.end_date)){
        continue;
      }
      if(filter.end_date && Date.parse(filter.end_date) < Date.parse(lock.start_date)){
        continue;
      }
      
      _lockList.push(lock_id);
    }
    return _lockList;
  }

  render() {
    let { rooms, locks, type } = this.props;
    let { curPage, perPage } = this.state.filter;

    let lockList = this.getFilteredList();
    let { start, end } = Pagination.getLimit(curPage, lockList.length, perPage);

    return (
      <div>
      {
        lockList.slice(start, end).map(lock_id => {
          let lock = locks[lock_id];
          return (
            <Item key={lock_id} type={type} rooms={rooms} lock={lock} chksum={lock.chksum} onEditClick={this.props.onEditClick} onDeleteLock={this.props.onDeleteLock}/>
          );
        })
      }
      <Pagination ref="page" length={5} total={lockList.length} per={perPage} cur={curPage} onPageClick={this.onPageClick.bind(this)}/>
      </div>
    );
  }
}
export default LockList;