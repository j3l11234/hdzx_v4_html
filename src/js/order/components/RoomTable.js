import React, { Component } from 'react';
import { shouldComponentUpdate } from 'react/lib/ReactComponentWithPureRenderMixin';

import Header from './RoomTableHeader';
import Cell from './RoomTableCell';
import Pagination from '../../common/components/Pagination';
import { getDateRange } from '../../common/units/Helpers';


class RoomTable extends Component {
  constructor (props) {
    super(props);
    this.shouldComponentUpdate = shouldComponentUpdate.bind(this);

    this.state = {
      perPage: 5,
      curPage: 1
    };
  }

  componentWillReceiveProps (nextProps) {
    if(!this.props.roomTable.roomList ||
      !nextProps.roomTable.roomList ||
      this.props.roomTable.roomList.length !== !nextProps.roomTable.roomList.length){
        this.setState({curPage: 1})
    }
  }

  onScroll (e) {
    this.refs.container.scrollLeft  = e.target.scrollLeft;
    this.refs.header.refs.container.scrollLeft  = e.target.scrollLeft;
  }

  onPageClick (page) {
    this.setState({curPage: page});
  }

  render () {
    let {rooms, onCellClick} = this.props;
    let {perPage, curPage} = this.state;
    let {dateList, roomList, roomTables} = this.props.roomTable;

    roomList = roomList ? roomList : [];
    let {start, end} = Pagination.getLimit(curPage, roomList.length, perPage);
    
    return (
      <div className="roomtable">
        <Header ref="header" dateList={dateList} onScroll={this.onScroll.bind(this)}/>
        <div className="rt-room-col">
        {
          roomList.slice(start, end).map(roomId => {
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
          roomList.slice(start, end).map(roomId => {
            let room = rooms[roomId];
            let {start, end} = getDateRange(room.max_before, room.min_before, room.by_week);
            start = Date.parse(start);
            end = Date.parse(end);

            return (
              <div className="rt-table-row" key={roomId} style={{width:(dateList ? dateList.length : 0)*90+'px'}}>
              {
                dateList && dateList.map(date => {
                  let ts = Date.parse(date);
                  let available = ts >= start && ts <= end;
                  let roomTable = roomTables[roomId][date] ? roomTables[roomId][date] : {};
                  let {hourTable, chksum} = roomTable;
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
        <Pagination ref="page" length={5} total={roomList.length} per={perPage} cur={curPage} onPageClick={this.onPageClick.bind(this)}/>
      </div>
    );
  }
}

export default RoomTable;