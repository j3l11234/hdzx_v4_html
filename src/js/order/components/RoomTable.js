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
          roomList.slice(pageRange.start, pageRange.end).map(roomId => {
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
          roomList.slice(pageRange.start, pageRange.end).map(roomId => {
            let room = rooms[roomId];
            let privAvail;
            if (room.type == ROOM_TYPE.TYPE_SIMPLE) {
              privAvail = checkPrivilege(user.privilege, USER_PRIV.PRIV_ORDER_SIMPLE);
            } else if(room.type == ROOM_TYPE.TYPE_ACTIVITY) {
              privAvail = checkPrivilege(user.privilege, USER_PRIV.PRIV_ORDER_ACTIVITY);
            }
            
            return (
              <div className="rt-table-row" key={roomId} style={{width:(dateList ? dateList.length : 0)*90+'px'}}>
              {
                dateList && dateList.map(date => {
                  let roomTable = roomTables[date+'_'+roomId];
                  let dateAvail = roomTable.available;
                  let {hourTable, chksum} = roomTable;
                  return (
                    <Cell key={date+'_'+roomId} chksum={chksum} date={date} room={roomId} hourTable={hourTable} privAvail={privAvail} dateAvail={dateAvail} onCellClick={onCellClick}/>
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