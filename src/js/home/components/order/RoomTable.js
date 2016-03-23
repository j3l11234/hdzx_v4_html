import React, { Component } from 'react';
import {shouldComponentUpdate} from 'react-addons-pure-render-mixin';

import Header from './roomTableHeader';
import Cell from './roomTableCell';
import { getDateRange } from '../../../common/helpers/Helpers';

class RoomTable extends Component {
  constructor (props) {
    super(props);
    this.shouldComponentUpdate = shouldComponentUpdate.bind(this);
  }

  onScroll (e){
    this.refs.container.scrollLeft  = e.target.scrollLeft;
    this.refs.header.refs.container.scrollLeft  = e.target.scrollLeft;
  }

  render () {
    let {rooms, onCellClick} = this.props;
    let {dateList, roomList, roomTables} = this.props.roomTable;

    return (
      <div className="roomtable">
        <Header ref="header" dateList={dateList} onScroll={this.onScroll.bind(this)}/>
        <div className="rt-room-col">
        {
          roomList && roomList.map(roomId => {
            let room = rooms[roomId];
            
            return !room ? null : (
              <div key={roomId} className="rt-room-item">
                {room.name}<br />{room.number}
              </div>
            );
          })
        }
        </div>
        <div ref="container" className="rt-table-content" onScroll={this.onScroll.bind(this)}>
        {
          roomList && roomList.map(roomId => {
            let room = rooms[roomId];
            let {start, end} = getDateRange(room.max_before, room.min_before, room.by_week);
            start = Date.parse(start);
            end = Date.parse(end);

            return (
              <div className="rt-table-row" key={roomId}>
              {
                dateList && dateList.map(date => {
                  let ts = Date.parse(date);
                  let available = ts >= start && ts <= end;
                  let {hourTable, chksum} = roomTables[roomId][date];
                  return (
                    <Cell key={roomId+'_'+date} chksum={chksum} date={date} room={roomId} hourTable={hourTable} available={available} onCellClick={onCellClick}/>
                  );
                })
              }
              </div>
            );
          })
        }
        </div>
      </div>
    );
  }
}

export default RoomTable;