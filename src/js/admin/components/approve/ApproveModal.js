import React, { Component } from 'react';
import { shouldComponentUpdate } from 'react-addons-pure-render-mixin';
import { Button, Modal, Input, Alert } from 'react-bootstrap';

import Prop from '../../../common/components/PropGroup';

class ApproveModal extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = shouldComponentUpdate.bind(this);

    this.state = {
      show: false,
      loading: false,
      room: null,
      order: null
    }

  }

  showModal() {
    this.setState({ show: true });
  }

  hideModal() {
    this.setState({ show: false });
  }

  onSubmit() {
    let { type, operate, order } = this.state;
    let comment = this.refs.comment.getValue();
    
    this.setState({loading: true});
    this.props.onSubmit(type, operate, order.id, comment, (success,data) => {
      if(data.status == 200){
        this.setState({
          alert: { style: 'success', text: data.message}
        });
      }else{
        this.setState({loading: false});
        this.setState({
          alert: { style: 'danger', text: data.message}
        });
      }
    });
  }

  render() {
    let { show, loading, operate, dept, room, order } = this.state;

    dept = dept ? dept : {};
    room = room ? room : {};
    order = order ? order : {};

    let startHour,endHour
    if(order.hours){
      let hours = order.hours;
      startHour = parseInt(hours[0]);
      endHour = parseInt(hours[hours.length -1])+1;
    }
    
    let title = "";
    let operateBtn;
    switch(operate) {
      case 'approve':
        title = '审批通过';
        operateBtn = (<Button bsStyle="success"  disabled={loading} onClick={this.onSubmit.bind(this)}>审批通过</Button>);
        break;
      case 'reject':
        title = '审批驳回';
        operateBtn = (<Button bsStyle="danger"  disabled={loading} onClick={this.onSubmit.bind(this)}>审批驳回</Button>);
        break;
      case 'revoke':
        title = '审批撤销';
        operateBtn = (<Button bsStyle="warning"  disabled={loading} onClick={this.onSubmit.bind(this)}>审批撤销</Button>);
        break;
      default:
        break;
    }

    let alertNode = null;
    if(this.state.alert){
      let {style, text} = this.state.alert;
      alertNode = (<Alert bsStyle={style}>{text}</Alert>);
    }

    return (
      <Modal show={show} onHide={this.hideModal.bind(this)} backdrop={'static'}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <Prop groupClassName="col-sm-6" label="姓名" content={order.name} />
            <Prop groupClassName="col-sm-6" label="社团单位" content={dept.name} />
            <Prop groupClassName="col-sm-6" label="申请房间" content={room.name + ' - ' + room.number} />
            <Prop groupClassName="col-sm-6" label="申请时段" content={order.date + ' ' +startHour + '时 - ' + endHour + '时'} />
            <Prop groupClassName="col-sm-12" label="活动主题" content={order.title} />
          </div>
          <hr className="small" />
          <div className="row">
            <Input ref="comment" type="textarea" groupClassName="col-sm-12" label="审批批注" labelClassName="inline-label" placeholder="请填写安保措施" wrapperClassName="inline-control"/>
            <div className="col-sm-12">{alertNode}</div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.hideModal.bind(this)}>关闭</Button>
          {operateBtn}
        </Modal.Footer>
      </Modal>
    );
  }
}

export default ApproveModal;