import React, { Component } from 'react';
import { shouldComponentUpdate } from 'react-addons-pure-render-mixin';
import { Label, Table } from 'react-bootstrap';

import Item from './ApproveOrderItem';
import { getListFormTable } from '../../../common/helpers/Helpers';

class ApproveOrderList extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = shouldComponentUpdate.bind(this);
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
    let { depts, rooms, orders, type, orderList, onOperateClick } = this.props;
    return (
      <div>
        {
          orderList.map(orderId => {
            let order = orders[orderId];
            return (
              <Item key={orderId} depts={depts} rooms={rooms} type={type} order={order} chksum={order.chksum} onOperateClick={onOperateClick}/>
            );
          })
        }
      </div>
    );
  }
}

export default ApproveOrderList;