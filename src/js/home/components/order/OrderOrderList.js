import React, { Component } from 'react';
import { shouldComponentUpdate } from 'react-addons-pure-render-mixin';
import { Label, Table } from 'react-bootstrap';

import StatusLabel from '../../../common/components/StatusLabel';
import { getListFormTable } from '../../../common/helpers/Helpers';

class OrderOrderList extends Component {
  constructor(props) {
    super(props);
  }
    

  shouldComponentUpdate (nextProps, nextState) {
    return (
      this.props.chksum !== nextProps.chksum ||
      this.props.orders !== nextProps.orders ||
      this.props.depts !== nextProps.depts
    );
  }

  render() {
    function getStatusLabel(status){
      switch(status){
        default:
        return (<Label bsStyle="default">Default</Label>);
      }
      /*
        <p bo-switch="order.status">
          <span bo-switch-when="1" class="label label-info">负责人未审批</span>
          <span bo-switch-when="2" class="label label-danger">负责人审批驳回</span>
          <span bo-switch-when="3" class="label label-success">负责人审批通过</span>
          <span bo-switch-when="4" class="label label-danger">校团委审批驳回</span>
          <span bo-switch-when="5" class="label label-success">校团委审批通过</span>
        </p>
      */
    }

    let { depts, orders, ordered, used } = this.props;
    let orderList = getListFormTable(used).concat(getListFormTable(ordered));
    return (
      <Table condensed hover responsive>
        <thead>
          <tr>
            <th>申请人 / 时段</th>
            <th>主题 / 单位</th>
            <th>提交时间 / 状态</th>
          </tr>
        </thead>
        <tbody>
        {
          orderList.map(orderId => {
            let order = orders[orderId];
            if (!order){
              return null;
            }

            let dept = depts[order.dept_id];
            let name = order.student_no ? order.student_no : order.name;

            let submit_time = new String();
            if(order.submit_time){
              submit_time = (new Date(order.submit_time*1000)).Format('yyyy-MM-dd hh:mm:ss');
            }
            let hours = order.hours;
            let startHour = parseInt(hours[0]);
            let endHour = parseInt(hours[hours.length -1])+1;

            return (
              <tr key={orderId}>
                <td>
                  <span>{name}</span>
                  <br />
                  <span>{startHour}时 - {endHour}时</span>
                </td>
                <td>
                  <span>{order.title}</span>
                  <br />
                  <span>{dept.name}</span>
                </td>
                <td>
                  <span>{submit_time}</span>
                  <br />
                  <span><StatusLabel status={order.status} /></span>
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

export default OrderOrderList;