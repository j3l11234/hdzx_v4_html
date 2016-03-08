import React, { Component } from 'react';
import { shouldComponentUpdate } from 'react-addons-pure-render-mixin';
import { Table } from 'react-bootstrap';

import { getListFormTable } from '../../helpers/Helpers';

class OrderLockList extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = shouldComponentUpdate.bind(this);
  }

  shouldComponentUpdate (nextProps, nextState) {
    return (
      this.props.chksum !== nextProps.chksum ||
      this.props.locks !== nextProps.locks
    );
  }

  render() {
    let { locks, locked } = this.props;
    let lockList = getListFormTable(locked);

    return (
      <Table condensed hover responsive>
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
            let {hours, name} = lock;
            let startHour = parseInt(hours.get(0));
            let endHour = parseInt(hours.get(-1))+1;
            return (
              <tr key={lockId}>
                <td>
                  <span>{name}</span>
                </td>
                <td>
                  <span></span>
                </td>
                <td>
                  <span>{startHour}时 - {endHour}时</span>
                </td>
              </tr>
            );
          })
        }
        </tbody>
      </Table>
    );
  }
}

export default OrderLockList;