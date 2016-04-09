import '../common/Polyfills';
import React, { Component } from 'react';
import { shouldComponentUpdate } from 'react/lib/ReactComponentWithPureRenderMixin';
import ReactDOM from 'react-dom';

import RoomTableQuery from './components/RoomTableQuery';
import RoomTable from './components/RoomTable';
import OrderModal from './components/OrderModal';
import { isEmptyObject } from '../common/units/Helpers';
import { ajaxGet, ajaxPost } from '../common/units/AjaxApi';

class OrderPage extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = shouldComponentUpdate.bind(this);
    this.store = {
      entities: {},
      roomTable: {},
      order: {}
    };
    this.state = Object.assign({}, this.store);
  }

  componentDidMount() {
    ajaxGet('/order/getrooms', (success, data) => {
      if (success) {
        let {rooms, roomList} = data;
        this.store.entities = Object.assign({}, this.store.entities, { 
          rooms: Object.assign({}, this.store.entities.rooms, rooms)
        });
        this.store.roomTable = Object.assign({}, this.store.roomTable, {
          roomList: roomList
        });
        this.setState(this.store);
      }
    });
    ajaxGet('/order/getdepts', (success, data) => {
      if (success) {
        let {depts, deptList} = data;
        this.store.entities = Object.assign({}, this.store.entities, { 
          depts: Object.assign({}, this.store.entities.depts, depts)
        });
        this.store.order = Object.assign({}, this.store.order, {
          deptList: deptList
        }); 
        this.setState(this.store);
      }
    });

    this.doGetRoomTables();
  }

  onCellClick(room_id, date) {
    this.store.order = Object.assign({}, this.store.order, {
      room_id: room_id,
      date: date
    }); 
    this.setState(this.store);
    this.refs.modal.showModal();
  }

  doGetRoomTables (callback) {
    ajaxGet('/order/getroomtables', (success, data) => {
      if (success) {
        let {dateList, roomTables} = data;
        this.store.roomTable = Object.assign({}, this.store.roomTable, { 
          dateList: dateList,
          roomTables: roomTables
        });
        this.setState(this.store);
      }
      callback && callback(success, data); 
    });
  }

  doGetRoomUse (room, date, callback) {
    ajaxGet('/order/getroomuse?room='+room+'&date='+date, (success, data) => {
      if (success) {
        let {orders, locks, roomTable} = data;
        this.store.entities = isEmptyObject(orders) ? this.store.entities : Object.assign({}, this.store.entities, { 
          orders: Object.assign({}, this.store.entities.orders, orders)
        });
        this.store.entities = isEmptyObject(locks) ? this.store.entities : Object.assign({}, this.store.entities, { 
          locks: Object.assign({}, this.store.entities.locks, locks)
        });
        let newRoom = {};
        newRoom[date] = roomTable;
        newRoom = Object.assign({}, this.store.roomTable.roomTables[room], newRoom);
        let newRoomTables = {};
        newRoomTables[room] = newRoom;
        this.store.roomTable = Object.assign({}, this.store.roomTable, {
          roomTables: Object.assign({}, this.store.roomTable.roomTables, newRoomTables)
        }) 
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
    ajaxPost('/order/submitorder', data, (success, data) => {
      callback && callback(success, data); 
    });
  }

  render() {
    let { rooms, locks, depts, orders } = this.state.entities;
    let { room_id, date, deptList } = this.state.order;
    return(
      <div>
        <RoomTableQuery onQeuryClick={this.doGetRoomTables.bind(this)} />
        <hr />
        <RoomTable rooms={rooms} roomTable={this.state.roomTable} onCellClick={this.onCellClick.bind(this)}  />
        <OrderModal ref="modal" rooms={rooms} orders={orders} locks={locks} depts={depts} room_id={room_id} date={date} deptList={deptList} roomTables={this.state.roomTable.roomTables} 
          onSubmit={this.doSubmitOrder.bind(this)} onQueryUse={this.doGetRoomUse.bind(this)} onCaptcha={this.doGetCaptcha.bind(this)}/>
      </div>
    );
  }
}
ReactDOM.render(
  <OrderPage />,
  document.getElementById('order-page')
);
