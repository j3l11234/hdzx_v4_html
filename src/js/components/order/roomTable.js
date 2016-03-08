import React, { Component } from 'react';
import {shouldComponentUpdate} from 'react-addons-pure-render-mixin';

import Header from './roomTableHeader';
import Cell from './roomTableCell';

class RoomTable extends Component {
  constructor (props) {
    super(props);
    this.shouldComponentUpdate = shouldComponentUpdate.bind(this);
  }

  render () {
    let {rooms, onCellClick} = this.props;
    let {dateList, roomList, roomTables} = this.props.roomTable;

    return (
      <div className="roomtable">
        <Header dateList={dateList} />
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
        <div className="rt-table-content">
        {
          roomList && roomList.map(roomId => {
            return (
              <div className="rt-table-row" key={roomId}>
              {
                dateList && dateList.map(date => {
                  let {hourTable, chksum} = roomTables[roomId][date];
                  return (
                    <Cell key={roomId+'_'+date} chksum={chksum} date={date} room={roomId} hourTable={hourTable} onCellClick={onCellClick}/>
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