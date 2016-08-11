import React, { Component } from 'react';
import { shouldComponentUpdate } from 'react/lib/ReactComponentWithPureRenderMixin';

import { STATUS } from '../../common/constants/OrderStatus';

class StatusLabel extends Component {
  constructor (props) {
    super(props);
    this.shouldComponentUpdate = shouldComponentUpdate.bind(this);
  }

  render () {
    let { status, type } = this.props;
    if (status == STATUS.INIT){
      return (<span className="label label-primary">初始化</span>);
    } else if (status == STATUS.PASSED || 
      status == STATUS.SCHOOL_APPROVED ||
      status == STATUS.SIMPLE_APPROVED) {
      if (type == 'manager' || type == 'school') {
        return (<span className="label label-success">校团委审批通过</span>);
      } else if (type == 'auto') {
        return (<span className="label label-success">自动审批通过</span>);
      } else {
        return (<span className="label label-success">审批通过</span>);
      }
    } else if (status == STATUS.CANCELED) {
      return (<span className="label label-default">已取消</span>);
    } else if (status == STATUS.MANAGER_PENDING) {
      return (<span className="label label-info">待负责人审批</span>);
    } else if (status == STATUS.MANAGER_APPROVED ||
      status == STATUS.SCHOOL_PENDING) {
      if (type == 'manager') {
        return (<span className="label label-success">负责人审批通过</span>);
      } else if (type == 'school') {
        return (<span className="label label-info">待校团委审批</span>);
      } else {
        return (<span className="label label-info">待校团委审批</span>);
      }
    } else if (status == STATUS.MANAGER_REJECTED) {
      return (<span className="label label-danger">负责人审批驳回</span>);
    } else if (status == STATUS.SCHOOL_REJECTED) {
      return (<span className="label label-danger">校团委审批驳回</span>);
    } else if (status == STATUS.SIMPLE_PENDING) {
      return (<span className="label label-info">待琴房审批</span>);
    } else if (status == STATUS.SIMPLE_REJECTED) {
      return (<span className="label label-danger">琴房审批驳回</span>);
    }
    return null;
  }
}

export default StatusLabel;
