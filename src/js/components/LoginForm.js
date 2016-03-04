import React, { Component } from 'react';
import {shouldComponentUpdate} from 'react-addons-pure-render-mixin';
import { Alert, Input, ButtonInput } from 'react-bootstrap';

import FormValidator from '../helpers/FormValidator';

class LoginForm extends Component {
  constructor (props) {
    super(props);
    this.shouldComponentUpdate = shouldComponentUpdate.bind(this);
    
    this.state = {
      alert: null,
    }

    this.fv = new FormValidator(this, {
      username: {
        value: '',
        validator: (value) => {
          if(value === '') {
            return  '用户名不能为空';
          }
        }
      },
      password: {
        value: '',
        validator: (value) => {
          if(value === '') {
            return  '密码不能为空';
          }
        }
      },
      remember: {
        value: true,
        validator: (value) => {}
      }
    });
  }

  handleChange (name, event) {
    this.fv.handleChange.call(this.fv, name, event);
  }


  getBsStyle (name) {
    if(!this.fv.getInputError(name)){
      return null;
    }else{
      return 'error';
    }
  }

  onLoginClick (e) {    
    if(this.fv.validateAll()){
      let form = this.fv.getFormData();
      this.props.doLogin(form.username, form.password, form.remember,(success,data) => {
        if(data.status == 200){
          this.setState({
            alert: { style: 'success', text: data.message}
          });
        }else{
          this.setState({
            alert: { style: 'danger', text: data.message}
          });
        }
        console.log(success,data);
      });
    }else{
      this.setState({
        alert: { style: 'danger', text: this.fv.errorText}
      });
    }
  }

  render() {
    let alertNode = null;
    if(this.state.alert){
      let {style, text} = this.state.alert;
      alertNode = (<Alert bsStyle={style}>{text}</Alert>);
    }
    return (
      <form>
        <Input type="text" label="学号/用户名" bsStyle={this.getBsStyle.call(this, 'username')} onChange={this.handleChange.bind(this, 'username')} value={this.fv.getInputValue('username')}/>
        <Input type="password" label="密码" bsStyle={this.getBsStyle.call(this, 'password')} onChange={this.handleChange.bind(this, 'password')} value={this.fv.getInputValue('password')}/>
        <Input type="checkbox" label="记住我" onChange={this.handleChange.bind(this, 'remember')} checked={this.fv.getInputValue('remember')} />
        <ButtonInput bsStyle="primary" onClick={this.onLoginClick.bind(this)} value="登录" />
        {alertNode}          
      </form>
    );
  }
}



export default LoginForm;
