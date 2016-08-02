import React, { Component } from 'react';
import { shouldComponentUpdate } from 'react/lib/ReactComponentWithPureRenderMixin';

import FormAlert from '../../common/components/FormAlert';
import FormValidator from '../../common/units/FormValidator';
import { STATUS, LOOP, WEEKDAY } from '../../common/constants/LockStatus';

class LockRoomSelect extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = shouldComponentUpdate.bind(this);

    this.unselectedList = [];
    this.selectedList = [];

    this.state = {
      select_rooms:[],
    }
  }

  onSelectedChange(type, event){
    let el = event.target;
    let list = [];
     for (var i = 0, l = el.options.length; i < l; i++) {
      if (el.options[i].selected) {
        list.push(parseInt(el.options[i].value));
      }
    }
    if (type == 'unselected') {
      this.unselectedList = list;
    }else if (type == 'selected') {
      this.selectedList = list;
    }
  }

  onOpClick(type){
    let list;
    let select_rooms = this.state.select_rooms;
    if(type == 'delall'){
      list = [];
    } else if(type == 'delone') {
      list = [];
      for (var i = select_rooms.length - 1; i >= 0; i--) {
        if(this.selectedList.indexOf(select_rooms[i]) == -1){
          list.push(select_rooms[i]);
        }
      }
    } else if(type == 'addone') {
      list = this.unselectedList;
      for (var i = select_rooms.length - 1; i >= 0; i--) {
        if(list.indexOf(select_rooms[i]) == -1){
          list.push(select_rooms[i]);
        }
      }
    } else if(type == 'addall') {
      list = this.props.roomList;
    }

    this.setState({select_rooms:list});
    this.unselectedList = [];
    this.selectedList = [];
  }

  getRooms() {
    return this.state.select_rooms;
  }

  setRooms(select_rooms) {
    this.setState({select_rooms: select_rooms});
  }

  render() {
    let { rooms, roomList } = this.props;
    let { select_rooms } = this.state;
    return (
      <div className="row">
        <div className="form-group col-sm-4">
          <label>可选房间</label>
          <select ref="unselected" className="form-control" multiple size="3" onChange={this.onSelectedChange.bind(this,'unselected')} >
          {
            roomList && roomList.map(room_id => {
              let room = rooms[room_id];
              if (select_rooms.indexOf(room_id) == -1){
                return (
                  <option key={room_id} value={room_id}>{room.name+'('+room.number+')'}</option>
                );
              }
            })
          }
          </select>
        </div>
        <div className="form-group col-sm-4 text-center" style={{marginTop: 40}}>
          <div className="btn-group">
            <button type="button" className="btn btn-default" onClick={this.onOpClick.bind(this, 'delall')}>{'<<'}</button>
            <button type="button" className="btn btn-default" onClick={this.onOpClick.bind(this, 'delone')}>{'<'}</button>
            <button type="button" className="btn btn-default" onClick={this.onOpClick.bind(this, 'addone')}>{'>'}</button>
            <button type="button" className="btn btn-default" onClick={this.onOpClick.bind(this, 'addall')}>{'>>'}</button>
          </div>
        </div>
        <div className="form-group col-sm-4">
          <label>锁定房间</label>
          <select ref="selected" className="form-control" multiple size="3" onChange={this.onSelectedChange.bind(this,'selected')} >
          {
            roomList && roomList.map(room_id => {
              let room = rooms[room_id];
              if (select_rooms.indexOf(room_id) != -1){
                return (
                  <option key={room_id} value={room_id}>{room.name+'('+room.number+')'}</option>
                );
              }
            })
          }
          </select>
        </div>
      </div>
    );
  }
}

export default LockRoomSelect;