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
    ajaxGet('/data/getrooms', (success, data) => {
      if (success) {
        let {rooms, roomList} = data;
        let entities = Object.assign({}, this.store.entities, { 
          rooms,
        });
        let roomTable = Object.assign({}, this.store.roomTable, {
          roomList,
        });
        this.store = Object.assign({}, this.store, {
          entities,
          roomTable,
        });
        this.setState(this.store);
      }
    });
    ajaxGet('/data/getdepts', (success, data) => {
      if (success) {
        let {depts, deptMap} = data;
        let entities = Object.assign({}, this.store.entities, { 
          depts: depts
        });
        this.store = Object.assign({}, this.store, {
          entities,
          deptMap,
        }); 
        this.setState(this.store);
      }
    });
    ajaxGet('/user/getlogin', (success, data) => {
      if (success) {
        let { user } = data;
        this.store = Object.assign({}, this.store, {
          user,
        }); 
        this.setState(this.store);
      }
    });
  }

  componentDidMount() {
    this.refs.query.onQeury();
  }

  onCellClick(room_id, date, dateAvail, privAvail) {
    let modal = Object.assign({}, this.store.modal, {
      room_id,
      date,
      dateAvail,
      privAvail,
    });
    this.store = Object.assign({}, this.store, {
      modal,
    });
    this.setState(this.store);
    this.refs.modal.showModal();
  }

  doGetRoomTables (start_date, end_date, callback) {
    ajaxGet('/order/getroomtables?start_date='+start_date+'&end_date='+end_date, (success, data) => {
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
        let { orders, locks, roomTable } = data;
        let entities = Object.assign({}, this.store.entities);
        if(!isEmptyObject(orders)){
          entities.orders = Object.assign({}, entities.orders, orders);
        }
        if(!isEmptyObject(locks)){
          entities.locks = Object.assign({}, entities.locks, locks);
        }
        let roomTables = Object.assign({}, this.store.roomTable.roomTables);
        roomTables[room+'_'+date] = roomTable;
        this.store = Object.assign({}, this.store, {
          entities,
          roomTable: Object.assign({}, this.store.roomTable, {
            roomTables
          }),
        });
        this.setState(this.store);
      }
      callback && callback(success, data); 
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
        }
      </div>
    );
  }
}
ReactDOM.render(
  <OrderPage />,
  document.getElementById('order-page')
);
