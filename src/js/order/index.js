import '../common/Polyfills';
import React, { Component } from 'react';
import { shouldComponentUpdate } from 'react/lib/ReactComponentWithPureRenderMixin';
import update from 'react/lib/update';
import ReactDOM from 'react-dom';

import RoomTableQuery from './components/RoomTableQuery';
import RoomTable from './components/RoomTable';
import OrderModal from './components/OrderModal';
import { isEmptyObject } from '../common/units/Helpers';
import * as ServerApi from '../common/units/ServerApi';
import { ajaxGet, ajaxPost } from '../common/units/AjaxApi';

class OrderPage extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = shouldComponentUpdate.bind(this);
    this.store = {
      entities: {
        rooms: {},
        depts: {},
        orders: {},
        locks: {}
      },
      roomTable: {},
      user: {},
      modal: {},
      usage:{
        month: {},
        week: {}
      },
    };
    this.state = Object.assign({}, this.store);
  }

  componentWillMount() {
    this.doGetData();
  }

  componentDidMount() {
    this.refs.query.onQeury();
  }

  doGetData() {
    return ServerApi.Data.getdata('order').then(data => {
      let { room, dept, tooltip } = data;
      this.store = update(this.store, {
        entities: {
          rooms: {$merge: room.rooms},
          depts: {$merge: dept.depts}
        },
        deptMap: {$set: dept.deptMap},
        tooltip: {$set: tooltip}
      });
      this.setState(this.store);
      return data;
    }, data => {
      //console.error(data);
      throw data;
    });
  }

  doGetRoomTables (start_date, end_date) {
    return ServerApi.Order.getroomtables(start_date, end_date).then(data => {
      let { roomList, dateList, roomTables} = data;
      this.store = update(this.store, {
        roomTable: {
          dateList: {$set: dateList},
          roomList: {$set: roomList},
          roomTables: {$set: roomTables},
        }
      });
      this.setState(this.store);
      return data;
    }, data => {
      //console.error(data);
      throw data;
    })
  }

  onCellClick(date, room_id, available) {
    this.store = update(this.store, {
      modal: {$set: {
        room_id,
        date,
        available
      }}
    });
    this.setState(this.store);
    this.refs.modal.showModal();
  }

  doGetRoomUse (date, room_id, callback) {
    return ServerApi.Order.getroomuse(date, room_id).then(data => {
      let { orders, locks, roomTable } = data;

      this.store = update(this.store, {
        entities: {
          orders: {$merge: orders},
          locks: {$merge: locks}
        },
        roomTable: {
          roomTables:{
            [date + '_' + room_id]: {$set: roomTable}
          }
        }
      });
      this.setState(this.store);
      return data;
    }, data => {
      throw data;
    });
  }

  doGetUsage(date, callback) {
    ajaxGet('/order/getusage?date='+date, (success, data) => {
      if (success) {
        this.store = Object.assign({}, this.store, {
          usage: {
            date,
            month: data.month,
            week: data.week
          }
        });
        this.setState(this.store);
      }
      callback && callback(success, data); 
    });
  }
  
  doGetCaptcha (callback) {
    ajaxGet('/order/captcha?refresh=1&r='+Math.random(), (success, data) => {
      callback && callback(success, data); 
    });
  }

  doSubmitOrder (data, callback) {
    ajaxPost('/order/submitorder', data, (success, reData) => {
      if (success) {
        this.doGetRoomUse(data.room_id, data.date);
        this.doGetUsage(data.date);
      }
      callback && callback(success, reData); 
    });
  }

  onFilter(perPage) {
    this.refs.list.setFilter({
      perPage,
      curPage: 1
    });
  }

  render() {
    let { rooms, locks, orders, depts } = this.state.entities;
    let { modal, user, roomTable, usage, deptMap } = this.state;
    return(
      <div>
        <RoomTableQuery ref="query" onQeury={this.doGetRoomTables.bind(this)} onFilter={this.onFilter.bind(this)} />
        <hr />
        <RoomTable ref="list" rooms={rooms} roomTable={roomTable} user={user} onCellClick={this.onCellClick.bind(this)}  />
        <OrderModal ref="modal" rooms={rooms} orders={orders} locks={locks} user={user} room_id={modal.room_id} date={modal.date} dateAvail={modal.dateAvail} privAvail={modal.privAvail}
          roomTables={roomTable.roomTables} usage={usage} depts={depts} deptMap={deptMap}
          onSubmit={this.doSubmitOrder.bind(this)} onQueryUse={this.doGetRoomUse.bind(this)} doGetUsage={this.doGetUsage.bind(this)} onCaptcha={this.doGetCaptcha.bind(this)}/>
      </div>
    );
  }
}
ReactDOM.render(
  <OrderPage />,
  document.getElementById('order-page')
);
