import '../common/Polyfills';
import React, { Component } from 'react';
import { shouldComponentUpdate } from 'react/lib/ReactComponentWithPureRenderMixin';
import update from 'react/lib/update';
import ReactDOM from 'react-dom';
import md5 from 'md5';

import Query from './components/LockQuery';
import List from './components/LockList';
import Modal from './components/LockModal';
import ApplyModal from './components/LockApplyModal';
import * as ServerApi from '../common/units/ServerApi';
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
      roomList: [],
      lockList: [],
      modal: {
        mode: 'add',
        lock_id: 0,
      }
    };
    this.state = this.store;
  }

  componentWillMount() {
    let req = {room:1};
    if(this.props.type == 'user') {
      req['tooltip'] = 'lock';
    }

    ServerApi.Data.getMetaData(req).then(data => {
      let { room , tooltip } = data;
      this.store = update(this.store, {
        entities: {
          rooms: {$merge: room.rooms},
        },
        roomList: {$set: room.roomList},
        tooltip: {$set: tooltip}
      });
      this.setState(this.store);
      return data;
    });
  }

  componentDidMount() {
    this.refs.query.onQeury();
    this.refs.query.onFilterClick();
  }

  doGetLocks() {
    return ServerApi.Lock.getLocks().then(data => {
      let {locks, lockList} = data;

      //计算chksum
      for (var lock_id in locks) {
        let lcok = locks[lock_id];
        lcok.chksum = md5(JSON.stringify(lcok)).substr(0,6);
      }
      this.store = update(this.store, {
        entities: {
          locks: {$merge: locks},
        },
        lockList: {$set: lockList}
      });
      this.setState(this.store);
      return data;
    });
  }
  
  onEditClick(lock_id) {
    this.store = update(this.store, {
      modal: {
        mode: {$set: 'edit'},
        lock_id: {$set: lock_id},
      },
    });
    this.setState(this.store);
    this.refs.modal.showModal();
  }

  onAddClick() {
    this.store = update(this.store, {
      modal: {
        mode: {$set: 'add'},
        lock_id: {$set: '0'},
      },
    });
    this.setState(this.store);
    this.refs.modal.showModal();
  }

  onApplyClick() { ;
    this.refs.applyModal.showModal();
  }

  doSubmitLock(data) {
    return ServerApi.Lock.submitLock(data).then(data => {
      this.refs.query.onQeury();
      return data;
    });
  }

  doDeleteLock(lock_id) {
    return ServerApi.Lock.deleteLock(lock_id).then(data => {
      this.refs.query.onQeury();
      return data;
    });
  }

  doApplyLock(data) {
    return ServerApi.Lock.applyLocks(data);
  }

  onFilter(filter) {
    filter.curPage = 1;
    this.refs.list.setFilter(filter);
  }

  render() {
    let { type } = this.props;
    let { rooms, locks} = this.state.entities;
    let { roomList, lockList, tooltip } = this.state;
    let { lock_id, mode } = this.state.modal;
    let lock = locks[lock_id];
    return (
      <div>
        {tooltip ? <div key='tooltip' dangerouslySetInnerHTML={{__html: tooltip}} /> : null}
        <Query ref="query" type={type} rooms={rooms} roomList={roomList} 
          onQeury={this.doGetLocks.bind(this)} onFilter={this.onFilter.bind(this)} onAddClick={this.onAddClick.bind(this)} onApplyClick={this.onApplyClick.bind(this)} />
        <hr />
        <List ref="list" type={type} rooms={rooms} locks={locks} lockList={lockList} onEditClick={this.onEditClick.bind(this)} onDeleteLock={this.doDeleteLock.bind(this)} />
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