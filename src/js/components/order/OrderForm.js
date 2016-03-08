import React, { Component } from 'react';
import { shouldComponentUpdate } from 'react-addons-pure-render-mixin';
import { Alert, Input } from 'react-bootstrap';

import FormValidator from '../../helpers/FormValidator';

class OrderForm extends Component {
  constructor (props) {
    super(props);
    this.shouldComponentUpdate = shouldComponentUpdate.bind(this);

    this.state = {
      alert: null
    }

    this.fv = new FormValidator(this, {
      name: {
        value: '',
        validator: (value) => {
          if(value === '') {
            return  '请认真填写姓名';
          }
        }
      },
      phone: {
        value: '13377088888',
        validator: (value) => {
          if(!/^\d{11}$/.test(value)) {
            return  '电话号码不正确';
          }
        }
      },
      title: {
        value: '',
        validator: (value) => {
          if(value.length < 2) {
            return  '请认真填写标题';
          }
        }
      },
      content: {
        value: '',
        validator: (value) => {
          if(value.length < 4) {
            return  '请认真填写活动内容';
          }
        }
      },
      number: {
        value: 1,
        validator: (value) => {
          if(value == 0) {
            return '请选择活动人数';
          }
        }
      },
      dept: {
        value: 0,
        validator: (value) => {
          if(value == 0) {
            return  '请选择社团单位';
          }
        }
      },
      secure: {
        value: '',
        validator: (value) => {
          if(value.length < 4) {
            return  '请认真填写安保措施';
          }
        }
      },
    });

  }

  handleChange (name, event) {
    this.fv.handleChange.call(this.fv, name, event);
  }

  getFormData () {
    if(this.fv.validateAll()){
      let form = this.fv.getFormData();
      return form;
    }else{
      this.setState({
        alert: { style: 'danger', text: this.fv.errorText}
      });
      return false;
    }
  }

  getBsStyle (name) {
    if(!this.fv.getInputError(name)){
      return null;
    }else{
      return 'error';
    }
  }

  // submitOrder () {
  //   let hasError = false;
  //   let errorText = '';
  //   let form = {};
  //   ['name', 'phone', 'title', 'content', 'number', 'dept', 'secure'].map(name => {
  //     let value = this.getInputValue(name);
  //     form[name] = value;
  //     let error = this.handleInput(name, value);
  //     if (error && !hasError) {
  //       hasError = true;
  //       errorText = error;
  //     }
  //   });
  //   if(this.props.form.get('hours').size < 1){
  //     hasError = true;
  //     errorText = '请选择时间';
  //   }
  //   form['room'] = this.props.form.get('room');
  //   form['date'] = this.props.form.get('date');
  //   form['hours'] = JSON.stringify(this.props.form.get('hours').toJSON());
  //   if (hasError) {
  //     this.setState({
  //       alert: {
  //         style: 'danger',
  //         text: errorText
  //       }
  //     });
  //   } else {
  //     this.hasSubmit = true;
  //     this.props.onSubmitOrder(form);
  //     //this.props.doLogin(form.username, form.password, form.remember);
  //   }
  // }

  // getFormData () {
  //   let form = {};
  //   ['name', 'phone', 'title', 'content', 'number', 'dept', 'secure'].map(name => {
  //     let value = this.getInputValue(name);
  //     form[name] = value;
  //   });
  //   return form;
  // }

  render() {
    let alertNode = null;
    if(this.state.alert){
      let {style, text} = this.state.alert;
      alertNode = (<Alert bsStyle={style}>{text}</Alert>);
    }

    let { depts, deptList } = this.props;
    return (
      <form>
        <Input type="text" groupClassName="col-sm-6" label="姓名" labelClassName="inline-label" placeholder="姓名" wrapperClassName="inline-control"
          bsStyle={this.getBsStyle.call(this, 'name')} onChange={this.handleChange.bind(this, 'name')} value={this.fv.getInputValue('name')} />
        <Input type="text" groupClassName="col-sm-6" label="联系方式" labelClassName="inline-label" placeholder="联系方式" wrapperClassName="inline-control"
          bsStyle={this.getBsStyle.call(this, 'phone')} onChange={this.handleChange.bind(this, 'phone')} value={this.fv.getInputValue('phone')} />
        <Input type="text" groupClassName="col-sm-12" label="活动主题" labelClassName="inline-label" placeholder="请填写活动主题" wrapperClassName="inline-control" 
          bsStyle={this.getBsStyle.call(this, 'title')} onChange={this.handleChange.bind(this, 'title')} value={this.fv.getInputValue('title')} />
        <Input type="textarea" groupClassName="col-sm-12" label="活动内容" labelClassName="inline-label" placeholder="请填写活动内容" wrapperClassName="inline-control" 
          bsStyle={this.getBsStyle.call(this, 'content')} onChange={this.handleChange.bind(this, 'content')} value={this.fv.getInputValue('content')} />
        <Input type="select" ref="dateSelect" groupClassName="col-sm-6" label="活动人数" labelClassName="inline-label" placeholder="select" wrapperClassName="inline-control"
          bsStyle={this.getBsStyle.call(this, 'number')} onChange={this.handleChange.bind(this, 'number')} value={this.fv.getInputValue('number')} >
          <option value="0">请选择</option>
          <option value="1">&lt;5</option>
          <option value="2">5-10</option>
          <option value="3">10-50</option>
          <option value="4">50-100</option>
          <option value="5">&gt;100</option>
        </Input>
        <Input type="select" ref="dateSelect" groupClassName="col-sm-6" label="社团单位" labelClassName="inline-label" placeholder="select" wrapperClassName="inline-control"
        bsStyle={this.getBsStyle.call(this, 'dept')} onChange={this.handleChange.bind(this, 'dept')} value={this.fv.getInputValue('dept')} >
          <option value="0">请选择</option>
          {
            deptList.map(dept_id => {
              let dept = depts[dept_id];
              return (
                <option key={dept_id} value={dept_id}>{dept.name}</option>
              );
            })
          }
        </Input>
        <Input type="textarea" groupClassName="col-sm-12" label="安保措施" labelClassName="inline-label" placeholder="请填写安保措施" wrapperClassName="inline-control"
          bsStyle={this.getBsStyle.call(this, 'secure')} onChange={this.handleChange.bind(this, 'secure')} value={this.fv.getInputValue('secure')} />
        <div className="col-sm-12">{alertNode}</div>
      </form>
    );
  }
}

export default OrderForm;