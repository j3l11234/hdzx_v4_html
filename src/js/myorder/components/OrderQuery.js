import React, { Component } from 'react';
import { shouldComponentUpdate } from 'react/lib/ReactComponentWithPureRenderMixin';

import FormAlert from '../../common/components/FormAlert';
import FormValidator from '../../common/units/FormValidator';

class OrderQuery extends Component {
  constructor (props) {
    super(props);
    this.shouldComponentUpdate = shouldComponentUpdate.bind(this);

    this.state = {
      alert: null,
    }

    this.fv = new FormValidator(this, {
      start_date: {
        value: _Server_Data_.start_date ? _Server_Data_.start_date : '',
        validator: (value) => {
          if(!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            return  '请输入开始日期';
          }
        }
      },
      end_date: {
        value: _Server_Data_.end_date ? _Server_Data_.end_date : '',
        validator: (value) => {
          if(!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            return  '请输入结束日期';
          }
        }
      },
    });
  }
  
  handleChange (name, event) {
    this.fv.handleChange.call(this.fv, name, event);
  }

  onQeury (e) {
    e && e.preventDefault();

    if (this.fv.validateAll()) {
      let formData = this.fv.getFormData();

      this.setState({alert: null});
      this.setState({loading: true});

      this.props.onQeury(formData.start_date, formData.end_date, (success, data) => {
        this.setState({loading: false});
        if (success) {

        }else{
          this.setState({
            alert: { style: 'danger', text: data.message}
          });
        }
      });
    } else {
      this.setState({
        alert: { style: 'danger', text: this.fv.errorText}
      });
    }
  }

  getBsStyle (name) {
    if(!this.fv.getInputError(name)){
      return null;
    }else{
      return 'has-error';
    }
  }

  render() {
    return (
      <form onSubmit={this.onQeury.bind(this)} >
        <div className="row">
          <div className={'form-group col-sm-6 col-md-4 '+this.getBsStyle.call(this, 'start_date')}>
            <label className="control-label inline-label">开始日期</label>
            <div className="input-group">
              <input type="date" placeholder="开始日期" className="form-control" onChange={this.handleChange.bind(this, 'start_date')} value={this.fv.getInputValue('start_date')} />
              <span className="input-group-addon"><span className="glyphicon glyphicon-calendar" /></span>
            </div>
          </div>
          <div className={'form-group col-sm-6 col-md-4 '+this.getBsStyle.call(this, 'end_date')}>
            <label className="control-label inline-label">结束日期</label>
            <div className="input-group">
              <input type="date" placeholder="结束日期" className="form-control" onChange={this.handleChange.bind(this, 'end_date')} value={this.fv.getInputValue('end_date')} />
              <span className="input-group-addon"><span className="glyphicon glyphicon-calendar" /></span>
            </div>
          </div>
          <div className="form-group col-sm-6 col-md-4">
            <button type="submit" className="btn-block btn btn-primary" disabled={this.state.loading}>查找</button>
          </div>
          <div className="col-md-12">
            {this.state.alert?(<FormAlert style={this.state.alert.style} text={this.state.alert.text}/>):null}
          </div>
        </div>
      </form>
    );
  }
}
export default OrderQuery;