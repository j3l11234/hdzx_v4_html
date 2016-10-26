import React, { Component } from 'react';
import { shouldComponentUpdate } from 'react/lib/ReactComponentWithPureRenderMixin';

import FormAlert from '../../common/components/FormAlert';
import FormValidator from '../../common/units/FormValidator_';

class OrderExtModal extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = shouldComponentUpdate.bind(this);

    this.state = {
      alert: null,
      loading: false,
    }
  }

  componentWillMount() {
    this.fv = new FormValidator((()=>{
      return this.state;
    }).bind(this),this.setState.bind(this));
    this.fv.setInputs({
      prin_student: (value) => {
        if(!value ||　value.length < 2) {
          return  '请输入负责学生姓名';
        }
      },
      prin_student_phone: (value) => {
        if(!/^\d{11}$/.test(value)) {
          return  '请输入负责学生电话';
        }
      },
      prin_teacher: (value) => {
        if(!value ||　value.length < 2) {
          return  '请输入负责老师姓名';
        }
      },
      prin_teacher_phone: (value) => {
        if(!/^\d{11}$/.test(value)) {
          return  '请输入负责老师电话';
        }
      },
      activity_type: (value) => {
        if(!value ||　value.length < 2) {
          return  '请输入活动类型';
        }
      },
      need_media: (value) => {
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
    let { order, onSubmit } = this.props;

    let fields = ['prin_student', 'prin_student_phone', 'prin_teacher', 'prin_teacher_phone', 'activity_type', 'need_media'];
    let errors = this.fv.validateInputs(fields);
    if(errors.length > 0) {
      this.setState({
        alert: { style: 'danger', text: errors[0].error}
      });
      return;
    }
    let formData = this.fv.getInputValues(fields);

    this.setState({loading: true});
    this.props.onSubmit(order.id, formData).then(data => {
      this.setState({
        alert: { style: 'success', text: data.message}
      });
    }, data => {
      this.setState({
        loading: false,
        alert: { style: 'danger', text: data.message}
      });
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
    let { loading } = this.state;

    return (
      <div ref="modal" className="modal fade" data-backdrop="static">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 className="modal-title">更新申请额外信息</h4>
            </div>
            <div className="modal-body">
              <form>
                <div className="row">
                  <div className={'form-group col-sm-6 '+this.getBsStyle.call(this, 'prin_student')}>
                    <label className="control-label inline-label">负责学生</label>
                    <div className="inline-control">
                      <input type="text" placeholder="负责学生姓名" className="form-control" value={this.fv.getInputValue('prin_student')} onChange={this.fv.handleChange.bind(this.fv, 'prin_student')} />
                    </div>
                  </div>
                  <div className={'form-group col-sm-6 '+this.getBsStyle.call(this, 'prin_student_phone')}>
                    <label className="control-label inline-label">联系方式</label>
                    <div className="inline-control">
                      <input type="phone" placeholder="负责学生联系方式" className="form-control" value={this.fv.getInputValue('prin_student_phone')} onChange={this.fv.handleChange.bind(this.fv, 'prin_student_phone')} />
                    </div>
                  </div>
                  <div className={'form-group col-sm-6 '+this.getBsStyle.call(this, 'prin_teacher')}>
                    <label className="control-label inline-label">负责老师</label>
                    <div className="inline-control">
                      <input type="text" placeholder="负责老师姓名" className="form-control" value={this.fv.getInputValue('prin_teacher')} onChange={this.fv.handleChange.bind(this.fv, 'prin_teacher')} />
                    </div>
                  </div>
                  <div className={'form-group col-sm-6 '+this.getBsStyle.call(this, 'prin_teacher_phone')}>
                    <label className="control-label inline-label">联系方式</label>
                    <div className="inline-control">
                      <input type="phone" placeholder="负责老师联系方式" className="form-control" value={this.fv.getInputValue('prin_teacher_phone')} onChange={this.fv.handleChange.bind(this.fv, 'prin_teacher_phone')} />
                    </div>
                  </div>
                  <div className={'form-group col-sm-6 '+this.getBsStyle.call(this, 'activity_type')}>
                    <label className="control-label inline-label">活动类型</label>
                    <div className="inline-control">
                      <input type="text" placeholder="活动类型" className="form-control" value={this.fv.getInputValue('activity_type')} onChange={this.fv.handleChange.bind(this.fv, 'activity_type')} />
                    </div>
                  </div>
                  <div className={'form-group col-sm-6 '+this.getBsStyle.call(this, 'need_media')}>
                    <label>
                      <input type="checkbox" onChange={this.fv.handleChange.bind(this.fv, 'need_media')} checked={this.fv.getInputValue('need_media')} />需要多媒体
                    </label>
                  </div>
                  { this.state.alert ?
                    <div className="col-sm-12">
                      <FormAlert style={this.state.alert.style} text={this.state.alert.text}/>
                    </div>
                  : null }
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal">关闭</button>
              <button type="button" className="btn btn-success" disabled={loading} onClick={this.onSubmit.bind(this)}>提交</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default OrderExtModal;