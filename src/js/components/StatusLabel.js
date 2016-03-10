import React, { Component } from 'react';
import {shouldComponentUpdate} from 'react-addons-pure-render-mixin';
import { Label } from 'react-bootstrap';

const STATUS = {
  INIT:               parseInt('0x01', 16), //初始化
  PASSED:             parseInt('0x02', 16), //已通过
  CANCELED:           parseInt('0x03', 16), //取消
  MANAGER_PENDING:    parseInt('0x10', 16), //负责人待审批
  MANAGER_APPROVED:   parseInt('0x11', 16), //负责人通过
  MANAGER_REJECTED:   parseInt('0x12', 16), //负责人驳回
  SCHOOL_PENDING:     parseInt('0x11', 16), //校团委待审批
  SCHOOL_APPROVED:    parseInt('0x02', 16), //校团委通过
  SCHOOL_REJECTED:    parseInt('0x22', 16), //校团委驳回
  AUTO_PENDING:       parseInt('0x30', 16), //自动待审批
  AUTO_APPROVED:      parseInt('0x02', 16), //自动通过
  AUTO_REJECTED:      parseInt('0x32', 16), //自动驳回
};

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
