import React, { Component } from 'react';
import { shouldComponentUpdate } from 'react/lib/ReactComponentWithPureRenderMixin';

import FormAlert from '../../common/components/FormAlert';
import FormValidator from '../../common/units/FormValidator';
import Prop from '../../common/components/PropGroup';

class ApproveModal extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = shouldComponentUpdate.bind(this);

    this.state = {
      alert: null,
      loading: false,
    }

    this.fv = new FormValidator({
      comment: {
        value: '',
        validator: (value) => {
          return null;
        }
      }
    });
  }

  handleChange (name, event) {
    this.fv.handleChange(name, event);
    this.forceUpdate();
  }

  showModal() {
    this.setState({
      alert: null,
      loading: false,
    });
    $(this.refs.modal).modal('show');
  }

  onSubmit() {
    let { operation, order } = this.props;

    this.fv.validateAll();
    let error = this.fv.getFirstError();
    if(error) {
      this.setState({
        alert: {style: 'danger', text: error}
      });
      return;
    }

    let formData = this.fv.getFormData();
    formData.order_id = order.id;

    this.setState({loading: true});
    this.props.onSubmit(operation, formData, (success, data) => {
      if(success) {
        this.setState({
          alert: { style: 'success', text: data.message}
        });
      } else {
        this.setState({loading: false});
        this.setState({
          alert: { style: 'danger', text: data.message}
        });
      }
    });
  } 

  getBsStyle (name) {
    if(!this.fv.getInputError(name)){
      return null;
    }else{
      return 'has-error';
    }
  } 

  render() {
    let { operation, order } = this.props;
    let { loading } = this.state;
    order = order ? order : {};

    let startHour,endHour
    if(order.hours){
      let hours = order.hours;
      startHour = parseInt(hours[0]);
      endHour = parseInt(hours[hours.length -1])+1;
    }
    
    let title = "";
    let conflict = order.conflict ? order.conflict.length > 0 : false;
    let operateBtn;
    switch(operation) {
      case 'approve':
        title = '审批通过';
        operateBtn = (<button type="button" className="btn btn-success" disabled={loading} onClick={this.onSubmit.bind(this)}>审批通过</button>);
        break;
      case 'reject':
        title = '审批驳回';
        operateBtn = (<button type="button" className="btn btn-danger" disabled={loading} onClick={this.onSubmit.bind(this)}>审批驳回</button>);
        break;
      case 'revoke':
        title = '审批撤销';
        operateBtn = (<button type="button" className="btn btn-warning" disabled={loading} onClick={this.onSubmit.bind(this)}>审批撤销</button>);
        break;
      default:
        break;
    }

    return (
      <div ref="modal" className="modal fade" data-backdrop="static">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 className="modal-title">{title}</h4>
            </div>
            <div className="modal-body">
              <form>
                <div className="row">
                  <Prop groupClassName="col-sm-6" label="姓名" content={order.name} />
                  <Prop groupClassName="col-sm-6" label="社团单位" content={order.dept_name} />
                  <Prop groupClassName="col-sm-6" label="申请房间" content={order.room_name} />
                  <Prop groupClassName="col-sm-6" label="申请时段" content={order.date + ' ' +startHour + '时 - ' + endHour + '时'} />
                  <Prop groupClassName="col-sm-12" label="活动主题" content={order.title} />
                  <div className="col-sm-12">
                    <hr className="small" />
                  </div>
                  <div className={'form-group col-sm-12 '+this.getBsStyle.call(this, 'comment')}>
                    <label className="control-label inline-label">审批批注</label>
                    <div className="inline-control">
                      <input type="text" placeholder="请填写审批批注" className="form-control" onChange={this.handleChange.bind(this, 'comment')} value={this.fv.getInputValue('comment')} />
                    </div>
                  </div>
                  <div className="col-sm-12">
                  {
                    conflict ? <FormAlert style="danger" text="审批通过该预约将会撤回其他预约"/> : null
                  }
                  {
                    this.state.alert ? <FormAlert style={this.state.alert.style} text={this.state.alert.text}/> : null
                  }
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal">关闭</button>
              {operateBtn}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ApproveModal;