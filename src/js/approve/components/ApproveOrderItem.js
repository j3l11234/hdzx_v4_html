import React, { Component } from 'react';
import { shouldComponentUpdate } from 'react/lib/ReactComponentWithPureRenderMixin';

import Prop from '../../common/components/PropGroup';
import StatusLabel from '../../common/components/StatusLabel';
import { STATUS } from '../../common/constants/OrderStatus';
import { TYPE_NAME } from '../../common/constants/OperationTypes';
import FormAlert from '../../common/components/FormAlert';
import { getAbstractStatus, hours2Range } from '../../common/units/Helpers';


class ApproveOrderItem extends Component {
  constructor (props) {
    super(props);
  }

  shouldComponentUpdate (nextProps, nextState) {
    return (this.props.chksum !== nextProps.chksum);
  }

  onOperationClick (operation) {
    let { order } = this.props;
    this.props.onOperationClick(order.id, operation);
  }

  onConflictClick (e) {
    let { order, onConflictClick } = this.props;
    onConflictClick(order.id);
  }


  getPanelStyle (status, conflict) {
    if (status == STATUS.STATUS_PENDING) {
      return conflict ? 'panel-warning' : 'panel-info';
    } else if (status == STATUS.STATUS_APPROVED || status == STATUS.STATUS_APPROVED_FIXED) {
      return 'panel-success';
    } else if (status == STATUS.STATUS_REJECTED || status == STATUS.STATUS_REJECTED_FIXED) {
      return 'panel-danger';
    } else {
      return 'panel-default';
    }
  }

  render () {
    let { type, order } = this.props;
    if (!order){
      return null;
    }

    let student_no = order.student_no ? order.student_no : ' ';
    let { start_hour, end_hour } = hours2Range(order.hours);
    let submit_time = order.submit_time ? new Date(order.submit_time*1000).Format('yyyy-MM-dd hh:mm:ss') : ' ';
    let issue_time = order.issue_time ? new Date(order.issue_time*1000).Format('yyyy-MM-dd hh:mm:ss') : '未发放'; 
    let status = getAbstractStatus(order.status, type);
    let conflict = order.conflict && (order.conflict.ordered || order.conflict.used || order.conflict.rejected) ? true : false;
    let conflict_appove = order.conflict && order.conflict.ordered ? true : false;

    //操作按钮生成
    let operationBtns = [];
    if (status == STATUS.STATUS_PENDING) {
      operationBtns.push((<button type="button" className="btn btn-block btn-success btn-sm" onClick={this.onOperationClick.bind(this,"approve")}>审批通过</button>));
      operationBtns.push((<button type="button" className="btn btn-block btn-danger btn-sm" onClick={this.onOperationClick.bind(this,"reject")}>审批驳回</button>));
      conflict && operationBtns.push((<button type="button" className="btn btn-block btn-warning btn-sm" onClick={this.onConflictClick.bind(this)}>查看冲突申请</button>));
    } else if (status == STATUS.STATUS_REJECTED || status == STATUS.STATUS_APPROVED){
      operationBtns.push((<button type="button" className="btn btn-block btn-warning btn-sm" onClick={this.onOperationClick.bind(this,"revoke")}>撤销审批</button>));
      operationBtns.push(null);
      conflict && operationBtns.push((<button type="button" className="btn btn-block btn-warning btn-sm" onClick={this.onConflictClick.bind(this)}>查看冲突申请</button>));
    } else if (status == STATUS.STATUS_APPROVED_FIXED || status == STATUS.STATUS_REJECTED_FIXED) {
      operationBtns.push(null);
      operationBtns.push(null);
      conflict && operationBtns.push((<button type="button" className="btn btn-block btn-warning btn-sm" onClick={this.onConflictClick.bind(this)}>查看冲突申请</button>));
    }

    return (
      <div className={'panel ' + this.getPanelStyle(status, conflict_appove)}>
        <div className="panel-heading">
          <h4 className="panel-title">
            <a data-toggle="collapse" href={'#collapse-order-'+order.id}>
              <div className="row">
                <div className="col-sm-4">{order.dept_name+ ' - ' + order.name}</div>
                <div className="col-sm-4">{order.room_name}</div>
                <div className="col-sm-4">{`${order.date} ${start_hour}时 - ${end_hour}时`}</div>
              </div>
            </a>
          </h4>
        </div>
        <div className="panel-collapse collapse in" id={'collapse-order-'+order.id}>
          <div className="panel-body">
            <div className="row">
              <Prop groupClassName="col-sm-4" label="申请学号" content={student_no} />
              <Prop groupClassName="col-sm-4" label="联系方式" content={order.phone} />
              <Prop groupClassName="col-sm-4" label="活动人数" content={order.number} />
              <Prop groupClassName="col-sm-4" label="预约状态" content={(<StatusLabel status={order.status} />)} />
              <Prop groupClassName="col-sm-4" label="提交时间" content={submit_time} />
              <Prop groupClassName="col-sm-4" label="开门条发放" content={issue_time} />
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
                    <Prop groupClassName="col-sm-4" label="操作类型" content={TYPE_NAME[operation.type]} />
                    <Prop groupClassName="col-sm-8" label="操作标注" content={operation.comment} />
                    <Prop groupClassName="col-sm-4" label="操作人" content={operation.operator} />
                    <Prop groupClassName="col-sm-4" label="操作时间" content={time} />
                  </div>
                );
              })
            }
            <div className="row">
              <hr className="small" />
              {
                conflict_appove && status == STATUS.STATUS_PENDING ? 
                <div className="col-sm-12 form-group">
                  <FormAlert style="danger" text="该申请和其他申请冲突，请谨慎审批"/>
                </div>
                : null
              }
              {
                operationBtns.map((operationBtn,i) => {
                  return (
                    <div key={i} className="col-sm-4 form-group">
                      {operationBtn}
                    </div>
                  );
                })
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ApproveOrderItem;