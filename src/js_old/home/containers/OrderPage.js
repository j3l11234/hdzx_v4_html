import React, { Component } from 'react';
import {shouldComponentUpdate} from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';

import Modal from '../components/order/OrderModal';
import Query from '../components/order/RoomTableQuery';
import RoomTable from '../components/order/RoomTable';
import * as EntityActions from '../../common/actions/EntityActions';
import * as RoomTableActions from '../actions/RoomTableActions';
import * as ServerApi from '../../common/helpers/ServerApi';
import { isEmptyObject } from '../../common/helpers/Helpers';

class OrderPage extends Component {
	constructor(props) {
    super(props);
    this.shouldComponentUpdate = shouldComponentUpdate.bind(this);
  }

  showOrderModel(room_id, date){
    this.refs.modal.setState({room_id, date, loading:false});
    this.refs.modal.showModal();
  }

  doSubmitOrder (data, callback) {
    const { dispatch } = this.props;

    ServerApi.order_submitOrder(dispatch, data).then(data => {
      callback && callback(true, data);
    },error => {
      callback && callback(false, error);
    });
  }

  doGetRoomTables (callback){
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

  doGetRoomUse (room, date, callback){
    const { dispatch } = this.props;
    ServerApi.order_getRoomUse(dispatch, room, date).then(data => {
      let {orders, locks, roomTable} = data;
      !isEmptyObject(orders) && dispatch(EntityActions.updateOrder(orders));
      !isEmptyObject(locks) && dispatch(EntityActions.updateLock(locks));
      dispatch(RoomTableActions.updateOneRoomTable(room, date, roomTable));
      callback && callback(true, data); 
    },error => {
      callback && callback(false, error);
    });
  }
  
  doGetCaptcha (callback) {
    const { dispatch } = this.props;
    ServerApi.order_captcha(dispatch).then(data => {
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
      	<Query onQeuryClick={this.doGetRoomTables.bind(this)} />
        <hr />
        <RoomTable rooms={rooms} roomTable={roomTable} onCellClick={this.showOrderModel.bind(this)} />
        <Modal ref="modal" rooms={rooms} orders={orders} locks={locks} depts={depts} deptList={deptList} roomTables={roomTable.roomTables} 
          onSubmit={this.doSubmitOrder.bind(this)} onQueryUse={this.doGetRoomUse.bind(this)} onCaptcha={this.doGetCaptcha.bind(this)}/>
      </div>
    );
  }
}

export default connect(state => ({
	roomTable: state.roomTable,
  entities: state.entities,
  order: state.order
}))(OrderPage);