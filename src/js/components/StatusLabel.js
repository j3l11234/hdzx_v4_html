import React, { Component } from 'react';
import {shouldComponentUpdate} from 'react-addons-pure-render-mixin';
import { Label } from 'react-bootstrap';

import {STATUS} from '../constants/OrderStatus';

class StatusLabel extends Component {
  constructor (props) {
    super(props);
    this.shouldComponentUpdate = shouldComponentUpdate.bind(this);
  }

  render () {
    let { status, type } = this.props;
    if (status == STATUS.INIT){
      return (<Label bsStyle="primary">初始化</Label>);
    } else if (status == STATUS.PASSED || 
      status == STATUS.SCHOOL_APPROVED ||
      status == STATUS.AUTO_APPROVED) {
      if (type == 'manager' || type == 'school') {
        return (<Label bsStyle="success">校团委审批通过</Label>);
      } else if (type == 'auto') {
        return (<Label bsStyle="success">自动审批通过</Label>);
      } else {
        return (<Label bsStyle="success">审批通过</Label>);
      }
    } else if (status == STATUS.CANCELED) {
      return (<Label bsStyle="default">已取消</Label>);
    } else if (status == STATUS.MANAGER_PENDING) {
      return (<Label bsStyle="info">待负责人审批</Label>);
    } else if (status == STATUS.MANAGER_APPROVED ||
      status == STATUS.SCHOOL_PENDING) {
      if (type == 'manager') {
        return (<Label bsStyle="success">负责人审批通过</Label>);
      } else if (type == 'school') {
        return (<Label bsStyle="info">待校团委审批</Label>);
      } else {
        return (<Label bsStyle="info">待校团委审批</Label>);
      }
    } else if (status == STATUS.MANAGER_REJECTED) {
      return (<Label bsStyle="danger">负责人审批驳回</Label>);
    } else if (status == STATUS.SCHOOL_REJECTED) {
      return (<Label bsStyle="danger">校团委审批驳回</Label>);
    } else if (status == STATUS.AUTO_PENDING) {
      return (<Label bsStyle="info">待自动审批</Label>);
    } else if (status == STATUS.AUTO_REJECTED) {
      return (<Label bsStyle="danger">自动审批驳回</Label>);
    }
    return null;
  }
}

export default StatusLabel;
