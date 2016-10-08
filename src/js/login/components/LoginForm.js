import React, { Component } from 'react';
import { shouldComponentUpdate } from 'react/lib/ReactComponentWithPureRenderMixin';

import FormAlert from '../../common/components/FormAlert';
import FormValidator from '../../common/units/FormValidator';

class LoginForm extends Component {
  constructor (props) {
    super(props);
    this.shouldComponentUpdate = shouldComponentUpdate.bind(this);

    this.state = {
      alert: null,
      loading: false,
    }

    this.fv = new FormValidator({
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
    this.fv.handleChange(name, event);
    this.forceUpdate();
  }

  getBsStyle (name) {
    if(!this.fv.getInputError(name)){
      return null;
    }else{
      return 'has-error';
    }
  }

  onSubmit (e) {
    e && e.preventDefault();

    this.fv.validateAll();
    let error = this.fv.getFirstError();
    if (error) {
      this.setState({
        alert: {style: 'danger', text: error}
      });
      return;
    }

    let formData = this.fv.getFormData();

    this.setState({
      alert: null,
      loading: true
    });
    this.props.onLogin(formData).then(data => {
      this.setState({
        loading: false,
        alert: { style: 'success', text: data.message}
      });
      setTimeout(()=>{window.location.href=data.url}, 1000);
    }, data => {
      this.setState({
        loading: false,
        alert: { style: 'danger', text: data.message}
      });
    });
  }

  render() {
    return (
      <form onSubmit={this.onSubmit.bind(this)}>
        <div className="row">
          <div className={'form-group col-sm-12 '+this.getBsStyle.call(this, 'username')}>
            <label className="control-label">学号</label>
            <input type="text" placeholder="学号" className="form-control" onChange={this.handleChange.bind(this, 'username')} value={this.fv.getInputValue('username')} />
          </div>
          <div className={'form-group col-sm-12 '+this.getBsStyle.call(this, 'password')}>
            <label className="control-label">密码</label>
            <input type="password" placeholder="密码" className="form-control" onChange={this.handleChange.bind(this, 'password')} value={this.fv.getInputValue('password')} />
          </div>
          <div className="checkbox col-xs-6">
            <label>
              <input type="checkbox" onChange={this.handleChange.bind(this, 'remember')} checked={this.fv.getInputValue('remember')} />记住我
            </label>
          </div>
          <div className="form-group col-xs-6 text-right">
              <a href={_Server_Data_.BASE_URL+'/user/request-password-reset'}>忘记密码？</a>
          </div>
          <div className="clearfix" />
          <div className="form-group col-sm-6">
            <button type="submit" className="btn-block btn btn-primary" disabled={this.state.loading}>登录</button>
          </div>
          <div className="form-group col-sm-6">
            <a className="btn-block btn btn-default" href={_Server_Data_.BASE_URL+'/user/request-student-user'} role="button">激活新用户</a>
          </div>
        </div>    
        {this.state.alert?(<FormAlert style={this.state.alert.style} text={this.state.alert.text}/>):null}         
      </form>
    );
  }
}
export default LoginForm;
