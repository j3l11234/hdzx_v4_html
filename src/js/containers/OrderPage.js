import React, { Component } from 'react';
import {shouldComponentUpdate} from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';

import Modal from '../components/order/OrderModal';
import Query from '../components/order/RoomTableQuery';
import RoomTable from '../components/order/RoomTable';
import * as ServerApi from '../helpers/ServerApi';

class OrderPage extends Component {
	constructor(props) {
    super(props);
    this.shouldComponentUpdate = shouldComponentUpdate.bind(this);
  }

  showOrderModel(roomId, date){
    let roomTable = this.props.roomTable.roomTables[roomId][date];
    let room = this.props.entities.rooms[roomId];

    this.refs.modal.setState({room, date, roomTable, loading:false});
    this.refs.modal.showModal();
  }

  doSubmitOrder(data, callback) {
    const { dispatch } = this.props;

    ServerApi.order_submitOrder(dispatch, data).then(data => {
      callback && callback(true, data);
    },error => {
      callback && callback(false, error);
    });
  }

  doGetRoomTables(callback){
    const { dispatch } = this.props;
    ServerApi.order_getRoomTables(dispatch).then(data => {
      const { dateList, roomTables } = data;
      dispatch(RoomTableActions.updateRoomTables(roomTables));
      dispatch(RoomTableActions.updateDateList(dateList));
      callback && callback(true, data); 
    },error => {
      callback && callback(false, error);
    });
  }


  render() {
    let { roomTable } = this.props;
    let { rooms, locks, depts, orders } = this.props.entities;
    let { deptList } = this.props.order;
    
    return (
      <div>
      	<Query />
        <RoomTable rooms={rooms} roomTable={roomTable} onCellClick={this.showOrderModel.bind(this)} onQeuryClick={this.doGetRoomTables.bind(this)}/>
        <Modal ref="modal" orders={orders} locks={locks} depts={depts} deptList={deptList} onSubmit={this.doSubmitOrder.bind(this)}/>
      </div>
    );
  }
}

export default connect(state => ({
	roomTable: state.roomTable,
  entities: state.entities,
  order: state.order
}))(OrderPage);