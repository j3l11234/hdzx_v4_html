import React, { Component } from 'react';
import { shouldComponentUpdate } from 'react-addons-pure-render-mixin';
import { Button, Panel, Alert } from 'react-bootstrap';

import Prop from '../../../common/components/PropGroup';
import StatusLabel from '../../../common/components/StatusLabel';
import { STATUS } from '../../../common/constants/OrderStatus';
import { typeNames } from '../../../common/constants/OperationTypes';
import { getAbstractStatus } from '../../../common/helpers/Helpers';


class ApproveOrderItem extends Component {
  constructor (props) {
    super(props);
  }

  shouldComponentUpdate (nextProps, nextState) {
    return (this.props.chksum !== nextProps.chksum || this.props.type !== nextProps.type);
  }

  getPanelStyle (status, conflict) {
    if (status == STATUS.STATUS_PENDING) {
      if(conflict){
        return 'warning';
      }else{
        return 'info';
      }
    } else if (status == STATUS.STATUS_APPROVED) {
      return 'success';
    } else if (status == STATUS.STATUS_REJECTED) {
      return 'danger';
    }
  }

  onOperateClick (operate) {
    let { type, order } = this.props;
    this.props.onOperateClick(order.id, type, operate);
  }

  render () {
    let { depts, rooms, type, order } = this.props;
    if (!order){
      return null;
    }
    let dept = depts[order.dept_id];
    let room = rooms[order.room_id];

    let student_no = order.student_no ? order.student_no : ' ';
    let hours = order.hours;
    let startHour = parseInt(hours[0]);
    let endHour = parseInt(hours[hours.length -1])+1;
    let submit_time = order.submit_time ? new Date(order.submit_time*1000).Format('yyyy-MM-dd hh:mm:ss') : ' '; 
    let status = getAbstractStatus(order.status, type);
    let conflict = order.conflict.length > 1;

    let header = (
      <div className="row">
        <div className="col-sm-4">{dept.name+ ' - ' + order.name}</div>
        <div className="col-sm-4">{room.name + ' - ' + room.number}</div>
        <div className="col-sm-4">{order.date + ' ' +startHour + '时 - ' + endHour + '时'}</div>
      </div>
    );

    //冲突提示
    let alertNode;
    if(conflict && status == STATUS.STATUS_PENDING){
      alertNode = (<Alert bsStyle="danger">该预约和其他预约存在冲突！</Alert>);
    }

    //操作按钮生成
    let operateBtns = [];
    if(status == STATUS.STATUS_PENDING){
      operateBtns.push((<Button bsStyle="success" bsSize="small" block onClick={this.onOperateClick.bind(this,"approve")}>审批通过</Button>));
      operateBtns.push((<Button bsStyle="danger" bsSize="small" block onClick={this.onOperateClick.bind(this,"reject")}>审批驳回</Button>));
      if(conflict){
        operateBtns.push((<Button bsStyle="warning" bsSize="small" block onClick={this.onOperateClick.bind(this,"revoke")}>查看冲突预约</Button>));
      }
    }else if(status == STATUS.STATUS_REJECTED || status == STATUS.STATUS_APPROVED){
      operateBtns.push((<Button bsStyle="warning" bsSize="small" block onClick={this.onOperateClick.bind(this,"revoke")}>审批撤销</Button>));
      operateBtns.push(null);
      if(conflict){
        operateBtns.push((<Button bsStyle="warning" bsSize="small" block onClick={this.onOperateClick.bind(this,"revoke")}>查看冲突预约</Button>));
      }
    }

    return (
      <Panel collapsible defaultExpanded header={header} bsStyle={this.getPanelStyle(status, conflict)}>
        <div className="row">
          <Prop groupClassName="col-sm-4" label="申请学号" content={student_no} />
          <Prop groupClassName="col-sm-4" label="联系方式" content={order.phone} />
          <Prop groupClassName="col-sm-4" label="活动人数" content={order.number} />
          <Prop groupClassName="col-sm-4" label="预约状态" content={(<StatusLabel type={type} status={order.status} />)} />
          <Prop groupClassName="col-sm-8" label="提交时间" content={submit_time} />
          <Prop groupClassName="col-sm-12" label="申请主题" content={order.title} />
          <Prop groupClassName="col-sm-12" label="活动内容" content={order.content} />
          <Prop groupClassName="col-sm-12" label="安保措施" content={order.secure} />
        </div>
        {
          order.opList.map(operation => {
            let time = operation.time ? new Date(operation.time*1000).Format('yyyy-MM-dd hh:mm:ss') : '';
            return (
              <div key={operation.id} className="row">
                <hr className="small" />
                <Prop groupClassName="col-sm-4" label="操作类型" content={typeNames[operation.type]} />
                <Prop groupClassName="col-sm-8" label="操作标注" content={operation.commemt} />
                <Prop groupClassName="col-sm-4" label="操作人" content={operation.operator} />
                <Prop groupClassName="col-sm-4" label="操作时间" content={time} />
              </div>
            );
          })
        }
        <div className="row">
          <hr className="small" />
          <div className="col-sm-12">{alertNode}</div>
          {
            operateBtns.map((operateBtn,i) => {
              return (
                <div key={i} className="col-sm-4 stacked-margin">
                  {operateBtn}
                </div>
              );
            })
          }
        </div>
      </Panel>
    );
  }
}

export default ApproveOrderItem;