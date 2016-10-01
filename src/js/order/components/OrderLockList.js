import React, { Component } from 'react';
import { shouldComponentUpdate } from 'react/lib/ReactComponentWithPureRenderMixin';

import { getListFormTable } from '../../common/units/Helpers';
import { LOOP, WEEKDAY } from '../../common/constants/LockStatus';

class OrderLockList extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = shouldComponentUpdate.bind(this);
  }

  render() {
    let { locks, locked } = this.props;
    let lockList = getListFormTable(locked);

    return (
      <table className="table table-hover table-striped">
        <thead>
          <tr>
            <th>锁名称</th>
            <th>日期</th>
            <th>时段</th>
          </tr>
        </thead>
        <tbody>
        {
          lockList.map(lockId => {
            let lock = locks[lockId];
            if(!lock){
              return;
            }

            let {hours, title, loop_type, loop_day} = lock;
            let date;
            if(loop_type == LOOP.DAY){
              date = '每日';
            }else if(loop_type == LOOP.WEEK){
              date = '每周'+WEEKDAY[loop_day]+'';
            }else if(loop_type == LOOP.MONTH){
              date = '每月'+loop_day+'日';
            }
            let startHour = parseInt(hours[0]);
            let endHour = parseInt(hours[hours.length -1])+1;
            return (
              <tr key={lockId}>
                <td>{title}</td>
                <td>{date}</td>
                <td>{`${startHour}时 - ${endHour}时`}</td>
              </tr>
            );
          })
        }
        </tbody>
      </table>
    );
  }
}

export default OrderLockList;