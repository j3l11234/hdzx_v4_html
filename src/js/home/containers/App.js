import React, { Component } from 'react';
import {shouldComponentUpdate} from 'react-addons-pure-render-mixin';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ServerApi from '../../common/helpers/ServerApi';
import * as EntityActions from '../../common/actions/EntityActions';
import * as RoomTableActions from '../../common/actions/RoomTableActions';
import * as UserActions from '../../common/actions/UserActions';
import * as OrderActions from '../actions/OrderActions';


import NavBar from './NavBar';

class App extends Component {
	constructor(props) {
    super(props);
    this.shouldComponentUpdate = shouldComponentUpdate.bind(this);
  }

	componentDidMount() {
    const { dispatch } = this.props;
    getInitData(dispatch);
  }

  render() {
    const { children } = this.props;
    return (
      <div className="container">
        <NavBar />
        {children}
      </div>
    );
  }
};

function getInitData(dispatch) {
  ServerApi.meta_getRooms(dispatch).then(data => {
    const { roomList, rooms } = data;
    dispatch(EntityActions.updateRoom(rooms));
    dispatch(RoomTableActions.updateRoomList(roomList));
  },error => {});

  ServerApi.meta_getDepts(dispatch).then(data => {
    const { deptList, depts } = data;
    dispatch(EntityActions.updateDept(depts));
    dispatch(OrderActions.updateDeptList(deptList));
  },error => {});

  ServerApi.user_getLogin(dispatch).then(data => {
    const { user } = data;
    dispatch(UserActions.login(user));
  },error => {});

  ServerApi.order_getRoomTables(dispatch).then(data => {
    const { dateList, roomTables } = data;
    dispatch(RoomTableActions.updateRoomTables(roomTables));
    dispatch(RoomTableActions.updateDateList(dateList)); 
  },error => {});
}

export default connect(state => ({}))(App);
