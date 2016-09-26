import React, { Component } from 'react';
import { shouldComponentUpdate } from 'react/lib/ReactComponentWithPureRenderMixin';

import Header from './RoomTableHeader';
import Cell from './RoomTableCell';
import Pagination from '../../common/components/Pagination';
import { checkPrivilege } from '../../common/units/Helpers';
import { TYPE as ROOM_TYPE } from '../../common/constants/RoomStatus';
import { PRIV as USER_PRIV } from '../../common/constants/UserStatus';

class RoomTable extends Component {
  constructor (props) {
    super(props);
    this.shouldComponentUpdate = shouldComponentUpdate.bind(this);

    this.state = {
      filter: {
        perPage: 8,
        curPage: 1
      }
    };
  }

  componentWillReceiveProps (nextProps) {
    if(!this.props.roomTable.roomList ||
      !nextProps.roomTable.roomList ||
      this.props.roomTable.roomList.length !== !nextProps.roomTable.roomList.length){
        this.setState({curPage: 1})
    }
  }

  onScroll(e) {
    this.refs.container.scrollLeft  = e.target.scrollLeft;
    this.refs.header.refs.container.scrollLeft  = e.target.scrollLeft;
  }

  onPageClick(page) {
    this.setFilter(Object.assign({}, this.state.filter, { 
      curPage: page
    }));
  }
  
  setFilter(filter) {
    this.setState({
      filter
    });
  }

  render () {
    let { rooms, user, onCellClick } = this.props;
    let { curPage, perPage } = this.state.filter;
    let { dateList, roomList, roomTables } = this.props.roomTable;

    roomList = roomList ? roomList : [];
    let pageRange = Pagination.getLimit(curPage, roomList.length, perPage);
    
    return (
      <div className="roomtable">
        <Header ref="header" dateList={dateList} onScroll={this.onScroll.bind(this)}/>
        <div className="rt-room-col">
        {
          roomList.slice(pageRange.start, pageRange.end).map(room_id => {
            let room = rooms[room_id];
            return room ? (
              <div key={room_id} className="rt-room-item">
                {room.name}<br />{room.number}
              </div>
            ) : null;
          })
        }
        </div>
        <div ref="container" className="rt-table-content" onScroll={this.onScroll.bind(this)}>
        {
          roomList.slice(pageRange.start, pageRange.end).map(room_id => {
            return (
              <div className="rt-table-row" key={room_id} style={{width:(dateList ? dateList.length : 0)*90+'px'}}>
              {dateList && dateList.map(date => {
                let roomTable = roomTables[date + '_' + room_id];
                return roomTable ? (
                  <Cell key={date+'_'+room_id} roomTable={roomTable} date={date} room_id={room_id}
                    onCellClick={onCellClick.bind(this, date, room_id, roomTable.available)}/>
                ) : null;
              })}
              </div>
            );
          })
        }
        </div>
        <Pagination ref="page" length={5} total={roomList.length} per={perPage} cur={curPage} onPageClick={this.onPageClick.bind(this)}/>
      </div>
    );
  }
}

export default RoomTable;