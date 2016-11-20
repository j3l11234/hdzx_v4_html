import '../common/Polyfills';
import React, { Component } from 'react';
import { shouldComponentUpdate } from 'react/lib/ReactComponentWithPureRenderMixin';
import update from 'react/lib/update';
import ReactDOM from 'react-dom';
import md5 from 'md5';

import RoomTableQuery from './components/RoomTableQuery';
import RoomTable from './components/RoomTable';
import OrderModal from './components/OrderModal';
import * as ServerApi from '../common/units/ServerApi';

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
      timeOffset: 0,
      user: {},
      modal: {},
      usage:{
        month: {},
        week: {}
      },
    };
    this.state = Object.assign({}, this.store);

    this.action = {
      updatePeriod: this.updatePeriod.bind(this),
    }

    this.updatePeriod_id;
  }

  componentWillMount() {
    this.doGetData();
    this.doGetLogin();
  }

  componentDidMount() {
    this.updatePeriod();
    this.refs.query.onQeury();
  }

  doGetData() {
    return ServerApi.Data.getData('order', 'user').then(data => {
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

  doGetLogin() {
    return ServerApi.User.getLogin().then(data => {
      let { user } = data;
      this.store = update(this.store, {
        user: {$set: user}
      });
      this.setState(this.store);
      return data;
    }); 
  }

  doGetRoomTables(start_date, end_date) {
    return ServerApi.Order.getRoomTables(start_date, end_date).then(data => {
      let {roomList, dateList, roomTables, serverTime} = data;
      let timeOffset = serverTime*1000 - new Date().getTime();
      for (var dateRoom in roomTables) {
        let roomTable = roomTables[dateRoom];
        roomTable.chksum = md5(JSON.stringify(roomTable)).substr(0,6);
      }

      this.store = update(this.store, {
        roomTable: {
          dateList: {$set: dateList},
          roomList: {$set: roomList},
        },
        timeOffset: {$set: timeOffset}
      });
      this.setState(this.store);
      this.updatePeriod(roomTables);
      return data;
    })
  }

  doGetRoomUse(date, room_id) {
    return ServerApi.Order.getRoomUse(date, room_id).then(data => {
      let {orders, locks, roomTable, serverTime} = data;
      let timeOffset = serverTime*1000 - new Date().getTime();

      roomTable.chksum = md5(JSON.stringify(roomTable)).substr(0,6);
      this.store = update(this.store, {
        entities: {
          orders: {$merge: orders},
          locks: {$merge: locks}
        },
        roomTable: {
          roomTables: {
            [date + '_' + room_id]: {$merge: roomTable}
          }
        },
        timeOffset: {$set: timeOffset}
      });
      this.setState(this.store);
      this.updatePeriod();
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

  doSubmitOrder(data) {
    return ServerApi.Order.submitOrder(data).then(respData => {
      this.doGetRoomUse(data.date, data.room_id);
      this.doGetUsage(data.date);
      return respData;
    });
  }

  onCellClick(date, room_id) {
    this.doGetRoomUse(date, room_id);
    this.doGetUsage(date);

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

  updatePeriod(roomTables) {
    clearTimeout(this.updatePeriod_id);

    if (!roomTables) {
      roomTables = this.store.roomTable.roomTables;
    }

    let now = Math.floor((new Date().getTime() + this.store.timeOffset) / 1000);
    let expire = 600;
    let updateSpec = {};
    for (var dateRoom in roomTables) {
      let roomTable = roomTables[dateRoom];
      let status;
      let expire_ = 0;
      if (now >= roomTable.period.start && now < roomTable.period.end) {
        status = 'ACTIVE';
        expire_ = roomTable.period.end - now;
      } else if (now < roomTable.period.start) {
        status = 'UPCOMING';
        expire_ = roomTable.period.start - now;
      } else if(now >= roomTable.period.end) {
        status = 'MISSED';
      }

      if (roomTable.status != status){
        updateSpec[dateRoom] = {status:{$set: status}};
      }
      if (expire_ != 0 && expire_ < expire){
        expire = expire_;
      }
    }
    this.store = update(this.store, {
      roomTable: {
        roomTables: {$set: update(roomTables, updateSpec)}
      }
    });
    this.setState(this.store);
    this.updatePeriod_id = setTimeout(this.action.updatePeriod, (expire)*1000);
  }

  render() {
    let { rooms, locks, orders, depts } = this.state.entities;
    let { modal, user, roomTable, usage, deptMap, tooltip, timeOffset } = this.state;

    let _roomTable;
    let _room;
    if (roomTable.roomTables && modal.room_id && modal.date) {
      _roomTable = roomTable.roomTables[modal.date+'_'+modal.room_id];
      _room = rooms[modal.room_id]; 
    } 

    return(
      <div>
        {tooltip ? <div key='tooltip' dangerouslySetInnerHTML={{__html: tooltip}} /> : null}
        <RoomTableQuery ref="query" onQeury={this.doGetRoomTables.bind(this)} onFilter={this.onFilter.bind(this)} />
        <hr />
        <RoomTable ref="roomtable" rooms={rooms} roomTable={roomTable} onCellClick={this.onCellClick.bind(this)}  />
        <OrderModal ref="modal" room={_room} orders={orders} locks={locks} user={user} modal={modal}
          roomTable={_roomTable} usage={usage} depts={depts} deptMap={deptMap} timeOffset={timeOffset}
          onSubmit={this.doSubmitOrder.bind(this)}  onCaptcha={this.doGetCaptcha.bind(this)}/>
      </div>
    );
  }
}
ReactDOM.render(
  <OrderPage />,
  document.getElementById('order-page')
);
