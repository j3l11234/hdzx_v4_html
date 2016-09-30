import React, { Component } from 'react';
import { shouldComponentUpdate } from 'react/lib/ReactComponentWithPureRenderMixin';

import Prop from '../../common/components/PropGroup';
import { STATUS, LOOP, WEEKDAY } from '../../common/constants/LockStatus';
import { range2Hours, hours2Range } from '../../common/units/Helpers';

class LockItem extends Component {
  constructor (props) {
    super(props);
  }

  shouldComponentUpdate (nextProps, nextState) {
    return (this.props.chksum !== nextProps.chksum);
  }


  onEditClick (e) {
    let { lock } = this.props;
    this.props.onEditClick(lock.id);
  }

  onDelClick (e) {
    if (confirm("确认要删除该房间锁吗？")){
      let { lock, onDeleteLock } = this.props;
      onDeleteLock(lock.id).then(data => {
        alert(data.message);
      }, data => {
        alert(data.message);
      });;
    }  
  }

  getPanelStyle (status) {
    if (status == STATUS.ENABLE) {
      return 'panel-info';
    } else if (status == STATUS.DISABLE) {
      return 'panel-default';
    }
  }

  getStatusLabel(status){
    if (status == STATUS.ENABLE) {
      return (<span className="label label-primary">已启用</span>);
    } else if (status == STATUS.DISABLE) {
      return (<span className="label label-default">未启用</span>);
    }
  }


  render () {
    let { rooms, lock, type } = this.props;
    if (!lock){
      return null;
    }

    let room_name;
    if(lock.rooms.length == 1) {
      let room = rooms[lock.rooms[0]];
      room_name = room ? room.name+'('+room.number+')': '';
    } else {
      room_name = '多个房间';
    }

    let { start_hour, end_hour } = hours2Range(lock.hours);
    let lock_time = start_hour + '时 - ' + end_hour + '时';
    let lock_date;
    if (lock.loop_type == LOOP.DAY) {
      lock_date = '每日';
    } else if (lock.loop_type == LOOP.WEEK) {
      lock_date = '每周' + WEEKDAY[lock.loop_day];
    } else if (lock.loop_type == LOOP.MONTH) {
      lock_date = '每月' + lock.loop_day + '日';
    }

    return (
      <div className={'panel panel-lock ' + this.getPanelStyle(lock.status)}>
        <div className="panel-heading">
          <h4 className="panel-title">
            <a data-toggle="collapse" href={'#collapse-lock-' + lock.id}>
              <div className="row">
                <div className="col-sm-4">{lock.title}</div>
                <div className="col-sm-4">{room_name}</div>
                <div className="col-sm-4">{lock_date + ' ' + lock_time}</div>
              </div>
            </a>
            {type == 'admin' ? (<button type="button" className="btn btn-warning btn-sm btn-lockedit" onClick={this.onEditClick.bind(this)}>编辑</button>) : null}
            {type == 'admin' ? (<button type="button" className="btn btn-danger btn-sm btn-lockdel" onClick={this.onDelClick.bind(this)}>删除</button>) : null}
          </h4>
        </div>
        <div className="panel-collapse collapse in" id={'collapse-lock-' + lock.id}>
          <div className="panel-body">
            <div className="row">
              <Prop groupClassName="col-sm-4" label="开始日期" content={lock.start_date} />
              <Prop groupClassName="col-sm-4" label="结束日期" content={lock.end_date} />
              <Prop groupClassName="col-sm-4" label="锁信息" content={this.getStatusLabel(lock.status)} />

              <Prop groupClassName="col-sm-12" label="锁定房间" content={
                lock.rooms.map(room_id => {
                  let room = rooms[room_id];
                  let room_name = room.name+'('+room.number+')';
                  return room_name+', ';
                })
              } />
              <Prop groupClassName="col-sm-12" label="备注" content={lock.comment} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LockItem;