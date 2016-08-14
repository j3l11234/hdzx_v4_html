import React, { Component } from 'react';
import { shouldComponentUpdate } from 'react/lib/ReactComponentWithPureRenderMixin';

import Prop from '../../common/components/PropGroup';
import StatusLabel from '../../common/components/StatusLabel';
import { STATUS } from '../../common/constants/OrderStatus';
import { TYPE_NAME } from '../../common/constants/OperationTypes';
import { getAbsStatus } from '../../common/units/Helpers';


class ApproveOrderItem extends Component {
  constructor (props) {
    super(props);
  }

  shouldComponentUpdate (nextProps, nextState) {
    return (this.props.chksum !== nextProps.chksum);
  }

  // onOperateClick (operate) {
  //   let { type, order } = this.props;
  //   this.props.onOperateClick(order.id, type, operate);
  // }

  getPanelStyle (status) {
    if (status == STATUS.STATUS_PENDING) {
      return 'panel-info';
    } else if (status == STATUS.STATUS_APPROVED) {
      return 'panel-success';
    } else if (status == STATUS.STATUS_REJECTED) {
      return 'panel-danger';
    }
  }

  render () {
    let { order } = this.props;
    if (!order){
      return null;
    }

    let student_no = order.student_no ? order.student_no : ' ';
    let hours = order.hours;
    let startHour = parseInt(hours[0]);
    let endHour = parseInt(hours[hours.length -1])+1;
    let submit_time = order.submit_time ? new Date(order.submit_time*1000).Format('yyyy-MM-dd hh:mm:ss') : ' ';
    let issue_time = order.issue_time ? new Date(order.issue_time*1000).Format('yyyy-MM-dd hh:mm:ss') : '未发放'; 
    let status = getAbsStatus(order.status);


    // //操作按钮生成
    // let operateBtns = [];
    // if(status == STATUS.STATUS_PENDING){
    //   operateBtns.push((<Button bsStyle="success" bsSize="small" block onClick={this.onOperateClick.bind(this,"approve")}>审批通过</Button>));
    //   operateBtns.push((<Button bsStyle="danger" bsSize="small" block onClick={this.onOperateClick.bind(this,"reject")}>审批驳回</Button>));
    //   if(conflict){
    //     operateBtns.push((<Button bsStyle="warning" bsSize="small" block onClick={this.onOperateClick.bind(this,"revoke")}>查看冲突预约</Button>));
    //   }
    // }else if(status == STATUS.STATUS_REJECTED || status == STATUS.STATUS_APPROVED){
    //   operateBtns.push((<Button bsStyle="warning" bsSize="small" block onClick={this.onOperateClick.bind(this,"revoke")}>审批撤销</Button>));
    //   operateBtns.push(null);
    //   if(conflict){
    //     operateBtns.push((<Button bsStyle="warning" bsSize="small" block onClick={this.onOperateClick.bind(this,"revoke")}>查看冲突预约</Button>));
    //   }
    // }

    return (
      <div className={'panel ' + this.getPanelStyle(status)}>
        <div className="panel-heading">
          <h4 className="panel-title">
            <a data-toggle="collapse" href={'#collapse-order-'+order.id}>
              <div className="row">
                <div className="col-sm-4">{order.dept_name+ ' - ' + order.name}</div>
                <div className="col-sm-4">{order.room_name}</div>
                <div className="col-sm-4">{order.date + ' ' +startHour + '时 - ' + endHour + '时'}</div>
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
                    <Prop groupClassName="col-sm-8" label="操作标注" content={operation.commemt} />
                    <Prop groupClassName="col-sm-4" label="操作人" content={operation.operator} />
                    <Prop groupClassName="col-sm-4" label="操作时间" content={time} />
                  </div>
                );
              })
            }
          </div>
        </div>
      </div>
    );
  }
}

export default ApproveOrderItem;