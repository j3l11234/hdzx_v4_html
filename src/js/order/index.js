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
      roomTable: {
        roomList: [],
        dateList: [],
        roomTables: {}
      },
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
    return ServerApi.Data.getData('order').then(data => {
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
    });
  }

  doGetRoomTables (start_date, end_date) {
    return ServerApi.Order.getRoomTables(start_date, end_date).then(data => {
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
    })
  }

  doGetRoomUse (date, room_id) {
    return ServerApi.Order.getRoomUse(date, room_id).then(data => {
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
    });
  }

  doGetUsage(date) {
    return ServerApi.Order.getUsage(date).then(data => {
      this.store = update(this.store, {
        usage: {$set: {
          date: date,
          month: data.month,
          week: data.week
        }}
      });
      this.setState(this.store);
      return data;
    });
  }
  
  doGetCaptcha() {
    return ServerApi.Order.getCaptcha();
  }

  doSubmitOrder (data) {
    return ServerApi.Order.submitOrder(data);
  }

  onCellClick(date, room_id) {
    this.doGetRoomUse(date, room_id);
    this.doGetUsage(date,);

    this.store = update(this.store, {
      modal: {
        date: {$set: date},
        room_id: {$set: room_id}, 
      }
    });
    this.setState(this.store);
    this.refs.modal.showModal(); 
  }

  onFilter(perPage) {
    this.refs.roomtable.setFilter({
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
        <RoomTable ref="roomtable" rooms={rooms} roomTable={roomTable} onCellClick={this.onCellClick.bind(this)}  />
        <OrderModal ref="modal" rooms={rooms} orders={orders} locks={locks} user={user} modal={modal}
          roomTables={roomTable.roomTables} usage={usage} depts={depts} deptMap={deptMap}
          onSubmit={this.doSubmitOrder.bind(this)}  onCaptcha={this.doGetCaptcha.bind(this)}/>
      </div>
    );
  }
}
ReactDOM.render(
  <OrderPage />,
  document.getElementById('order-page')
);
