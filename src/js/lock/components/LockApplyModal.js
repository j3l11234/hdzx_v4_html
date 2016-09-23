import React, { Component } from 'react';
import { shouldComponentUpdate } from 'react/lib/ReactComponentWithPureRenderMixin';

import FormAlert from '../../common/components/FormAlert';
import FormValidator from '../../common/units/FormValidator';

class LockApplyModal extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = shouldComponentUpdate.bind(this);

    this.state = {
      loading: false,
      finished: false,
      alert: null,
    }

    let today = new Date();
    let start_date = today.Format('yyyy-MM-dd');
    today.setMonth(today.getMonth()+1);
    let end_date = today.Format('yyyy-MM-dd');

    this.fv = new FormValidator({
      start_date: {
        value: start_date,
        validator: (value) => {
          if(!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            return  '请输入开始日期';
          }
        }
      },
      end_date: {
        value: end_date,
        validator: (value) => {
          if(!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            return  '请输入结束日期';
          }
        }
      },
    });
  }

  componentWillReceiveProps(nextProps){
  }

  handleChange (name, event) {
    this.fv.handleChange(name, event);
    this.forceUpdate();
  }

  showModal() {
    this.reset();
    $(this.refs.modal).modal('show');
  }

  reset() {
    this.setState({
      loading: false,
      finished: false,
      alert: null,
    });
  }

  onSubmit() {
    let { onSubmit } = this.props;

    this.fv.validateAll();
    let error = this.fv.getFirstError();
    if(error) {
      this.setState({
        alert: {style: 'danger', text: error}
      });
      return;
    }

    let formData = this.fv.getFormData();

    this.setState({loading: true});
    onSubmit(formData, (success, data) => {
      if(success){
        this.setState({
          alert: { style: 'success', text: data.message},
          finished: true,
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
    let { } = this.props;
    let { loading,finished } = this.state;


    return (
      <div ref="modal" className="modal fade" data-backdrop="static">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 className="modal-title">应用房间锁</h4>
            </div>
            <div className="modal-body">
              <form>
                <div className="row">
                  <div className="col-sm-12">
                    <FormAlert style="info" text="&nbsp;&nbsp;&nbsp;&nbsp;对房间锁进行增加、删除、修改操作后，房间锁不会立即生效，请及时应用房间锁使其生效。该操作需要一定时间，请耐心等待。" />
                    <br />
                  </div>
                  <div className={'form-group col-sm-6 '+this.getBsStyle.call(this, 'start_date')}>
                    <label className="inline-label">开始日期</label>
                    <div className="inline-control">
                      <input type="date" placeholder="开始日期" className="form-control" onChange={this.handleChange.bind(this, 'start_date')} value={this.fv.getInputValue('start_date')} />
                    </div>
                  </div>
                  <div className={'form-group col-sm-6 '+this.getBsStyle.call(this, 'end_date')}>
                    <label className="inline-label">结束日期</label>
                    <div className="inline-control">
                      <input type="date" placeholder="结束日期" className="form-control" onChange={this.handleChange.bind(this, 'end_date')} value={this.fv.getInputValue('end_date')} />
                    </div>
                  </div>
                  <div className="col-sm-12">
                  {
                    this.state.alert ? (<FormAlert style={this.state.alert.style} text={this.state.alert.text}/>) : null
                  }
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal">关闭</button>
              {!finished ? 
                <button type="button" className="btn btn-success" disabled={loading} onClick={this.onSubmit.bind(this)}>提交</button> :
                <button type="button" className="btn btn-primary" data-dismiss="modal">确定</button>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LockApplyModal;