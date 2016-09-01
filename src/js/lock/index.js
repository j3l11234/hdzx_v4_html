import '../common/Polyfills';
import React, { Component } from 'react';
import { shouldComponentUpdate } from 'react/lib/ReactComponentWithPureRenderMixin';
import ReactDOM from 'react-dom';
import md5 from 'md5';

import Query from './components/LockQuery';
import List from './components/LockList';
import Modal from './components/LockModal';
import ApplyModal from './components/LockApplyModal';
import { ajaxGet, ajaxPost } from '../common/units/AjaxApi';
import { getListFormTable } from '../common/units/Helpers';


class LockPage extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = shouldComponentUpdate.bind(this);

    this.store = {
      entities: {
        rooms: {},
        locks: {}
      },
      lock: {
        roomList: [],
        lockList: [],
        mode: 'add'
      }
    };
    this.state = Object.assign({}, this.store);
  }

  componentWillMount() {
    ajaxGet('/data/getrooms', (success, data) => {
      if (success) {
        let {rooms, roomList} = data;
        this.store.entities = Object.assign({}, this.store.entities, { 
          rooms: Object.assign({}, this.store.entities.rooms, rooms)
        });
        this.store.lock = Object.assign({}, this.store.lock, {
          roomList: roomList
        });
        this.setState(this.store);
      }
    });
  }

  componentDidMount() {
    this.refs.query.onQeury();
    this.refs.query.onFilterClick();
  }

  doGetLocks(callback) {
    ajaxGet('/lock/getlocks', (success, data) => {
      if (success) {
        let {locks, lockList} = data;

        //计算chksum
        for (var lock_id in locks) {
          let lcok = locks[lock_id];
          lcok.chksum = md5(JSON.stringify(lcok)).substr(0,6);
        }

        this.store.entities = Object.assign({}, this.store.entities, { 
          locks: Object.assign({}, this.store.entities.locks, locks)
        });
        this.store.lock = Object.assign({}, this.store.lock, {
          lockList: lockList
        });
        this.setState(this.store);
      }
      callback && callback(success, data); 
    });
  }
  
  onEditClick(lock_id) {
    this.store.lock = Object.assign({}, this.store.lock, {
      mode: 'edit',
      lock_id: lock_id,
    }); 
    this.setState(this.store);
    this.refs.modal.showModal();
  }

  onAddClick() {
    this.store.lock = Object.assign({}, this.store.lock, {
      mode: 'add',
      lock_id: 0,
    }); 
    this.setState(this.store);
    this.refs.modal.showModal();
  }

  onApplyClick() { ;
    this.refs.applyModal.showModal();
  }

  onDelClick(lock_id, callback) {
    ajaxPost('/lock/deletelock', {lock_id}, (success, resData) => {
      if (success) {
        this.doGetLocks();
      }
      callback && callback(success, resData); 
    });
  }

  doSubmitLock(data, callback) {
    ajaxPost('/lock/submitlock', data, (success, resData) => {
      if (success) {
        this.doGetLocks();
      }
      callback && callback(success, resData); 
    });
  }

  doApplyLock(data, callback) {
    ajaxPost('/lock/applylock', data, (success, resData) => {
      callback && callback(success, resData); 
    });
  }

  onFilter(filter) {
    filter.curPage = 1;
    this.refs.list.setFilter(filter);
  }

  render() {
    let { type } = this.props;
    let { rooms, locks } = this.state.entities;
    let { roomList, lockList, lock_id, mode } = this.state.lock;
    let lock = locks[lock_id];
    return (
      <div>
        <Query ref="query" type={type} rooms={rooms} roomList={roomList} 
          onQeury={this.doGetLocks.bind(this)} onFilter={this.onFilter.bind(this)} onAddClick={this.onAddClick.bind(this)} onApplyClick={this.onApplyClick.bind(this)} />
        <hr />
        <List ref="list" type={type} rooms={rooms} locks={locks} lockList={lockList} onEditClick={this.onEditClick.bind(this)} onDelClick={this.onDelClick.bind(this)} />
        <Modal ref="modal" rooms={rooms} roomList={roomList} lock={lock} mode={mode} onSubmit={this.doSubmitLock.bind(this)} />
        <ApplyModal ref="applyModal" onSubmit={this.doApplyLock.bind(this)} />
      </div>
    );
  }
}
ReactDOM.render(
  <LockPage type={_Server_Data_.type} />,
  document.getElementById('lock-page')
);