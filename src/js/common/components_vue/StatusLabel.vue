<template>
  <span :class="'label '+ style.className">{{style.text}}</span>
</template>

<script>
import { STATUS } from '../constants/Order';

export default {
  name: 'StatusLabel',
  computed: {
    style() {
      let { status, type } = this;
      let className, text;
      if (status == STATUS.INIT){
        className = 'label-primary';
        text = '初始化';
      } else if (status == STATUS.PASSED || 
        status == STATUS.SCHOOL_APPROVED ||
        status == STATUS.SIMPLE_APPROVED) {
        className = 'label-success';
        if (type == 'manager' || type == 'school') {
          text = '校团委审批通过';
        } else if (type == 'auto') {
          text = '自动审批通过';
        } else {
          text = '审批通过';
        }
      } else if (status == STATUS.CANCELED) {
        className = 'label-default';
        text = '已取消';
      } else if (status == STATUS.MANAGER_PENDING) {
        className = 'label-info';
        text = '待负责人审批';
      } else if (status == STATUS.MANAGER_APPROVED ||
        status == STATUS.SCHOOL_PENDING) {
        className = 'label-info';
        if (type == 'manager') {
          className = 'label-success';
          text = '负责人审批通过';
        } else if (type == 'school') {
          text = '待校团委审批';
        } else {
          text = '待校团委审批';
        }
      } else if (status == STATUS.MANAGER_REJECTED) {
        className = 'label-danger';
        text = '负责人审批驳回';
      } else if (status == STATUS.SCHOOL_REJECTED) {
        className = 'label-danger';
        text = '校团委审批驳回';
      } else if (status == STATUS.SIMPLE_PENDING) {
        className = 'label-info';
        text = '待琴房审批';
      } else if (status == STATUS.SIMPLE_REJECTED) {
        className = 'label-danger';
        text = '琴房审批驳回';
      }
      return { className, text };
    }
  },
  methods: {
  },
  props: ['status', 'type'],
}

/*

import React from 'react';

import { STATUS } from '../../common/constants/OrderStatus';

function StatusLabel(props) {
  let { status, type } = props;
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

export default StatusLabel;
*/
</script>


