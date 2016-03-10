import React, { Component } from 'react';
import { shouldComponentUpdate } from 'react-addons-pure-render-mixin';
import { Panel, Row, Col } from 'react-bootstrap';

import Prop from '../PropGroup';

class ApproveOrderItem extends Component {
  constructor (props) {
    super(props);
  }

  shouldComponentUpdate (nextProps, nextState) {
    return (this.props.chksum !== nextProps.chksum);
  }

  getStatusLabel (status){
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

  render () {
    let { depts, rooms, order } = this.props;
    if (!order){
      return null;
    }
    let dept = depts[order.dept_id];
    let room = rooms[order.room_id];

    let name = order.student_no ? order.student_no + '-' + order.name : order.name;
    let hours = order.hours;
    let startHour = parseInt(hours[0]);
    let endHour = parseInt(hours[hours.length -1])+1;

    let submit_time = order.submit_time ? new Date(order.submit_time*1000).Format('yyyy-MM-dd hh:mm:ss') : '';
    
    let header = (
      <Row className="show-grid">
        <Col md={4}>{name}</Col>
        <Col md={4}>{room.name + ' - ' + room.number}</Col>
        <Col md={4}>{startHour + '时 - ' + endHour + '时'}</Col>
      </Row>
    );
    return (
      <Panel header={header}>
        <Prop groupClassName="col-sm-4" label="社团单位" content={dept.name} />
        <Prop groupClassName="col-sm-4" label="联系方式" content={order.phone} />
        <Prop groupClassName="col-sm-4" label="活动人数" content={order.number} />
        <Prop groupClassName="col-sm-4" label="预约状态" content="ss" />
        <Prop groupClassName="col-sm-8" label="提交时间" content={submit_time} />
        <Prop groupClassName="col-sm-12" label="申请主题" content={order.title} />
        <Prop groupClassName="col-sm-12" label="活动内容" content={order.content} />
        <Prop groupClassName="col-sm-12" label="安保措施" content={order.secure} />
      </Panel>
    );

    

/*
<div class="panel panel-info">
  <div class="panel-heading">
    <h4 class="panel-title">
      <a data-toggle="collapse" href="#collapse-0" aria-expanded="true" class="">   
        <div class="row">
          <div class="col-sm-4 org-name">经管学院-付琪皓</div>
          <div class="col-sm-4 room">团队讨论室4 - 403</div>
          <div class="col-sm-4 date-time">2016-03-10  12点 - 14点</div>
        </div>
      </a>
    </h4>
  </div>
  <div class="panel-collapse collapse in" id="collapse-0" aria-expanded="true">
    <div class="panel-body">
      <div class="row">
        <div class="col-sm-4 form-group">
          <label class="info-label">学号</label>
          <span class="info-content orderer">15241154</span>
        </div>
        <div class="col-sm-4 form-group">
          <label class="info-label">联系方式</label>
          <span class="info-content contact">13011177171</span>
        </div>
        <div class="col-sm-4 form-group">
          <label class="info-label">活动人数</label>
          <span class="info-content number">&lt;5</span>
        </div>
        <div class="col-sm-4 form-group">
          <label class="info-label">预约状态</label>
          <span class="info-content status"><span class="label label-info ">负责人未审批</span></span>
        </div>
        <div class="col-sm-8 form-group">
          <label class="info-label">提交时间</label>
          <span class="info-content no-worp order_time">2016-03-09 18:43:15</span>
        </div>  
        <div class="col-sm-12 form-group">
          <label class="info-label">申请主题</label>
          <span class="info-content title">小组讨论</span>
        </div>
        <div class="col-sm-12 form-group">
          <label class="info-label">活动内容</label>
          <span class="info-content content">有关课程组织的论题讨论</span>
        </div>
        <div class="col-sm-12 form-group">
          <label class="info-label">安保措施</label>
          <span class="info-content secure">保证最基本安保措施</span>
        </div>
        <div class="col-sm-12 form-div">
          <hr>
        </div>
        <div class="col-sm-4 form-group">
          <label class="info-label">审批时间</label>
          <span class="info-content no-worp approve-datetime"></span>
        </div>
        <div class="col-sm-4 form-group">
          <label class="info-label">审批人员</label>
          <span class="info-content approve-approver"></span>
        </div>
        <div class="col-sm-4 form-group">
          <label class="info-label">审批结果</label>
          <span class="info-content approve-status"><span class="label label-info">待负责人审批</span></span>
        </div>
        <div class="col-sm-12 form-group">
          <label class="info-label">审批批注</label>
          <span class="info-content approve-comment"></span>
        </div>
        <div class="col-sm-4 col-md-3 form-group">
          
        </div>
        <div class="col-sm-4 col-md-4 col-md-offset-1 form-group">
            <button type="button" class="btn btn-success btn-sm btn-block btn-pass" onclick="onApproveClick(this,1)">审批通过</button>
          </div>
          <div class="col-sm-4 col-md-4 form-group">
            <button type="button" class="btn btn-danger btn-sm btn-block btn-reject" onclick="onApproveClick(this,2)">审批驳回</button>
            
          </div>        <div class="col-sm-12">
          
        </div>
      </div>
    </div>
  </div>
</div>
*/
  }
}

export default ApproveOrderItem;