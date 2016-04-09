import '../common/Polyfills';
import React, { Component } from 'react';
import { shouldComponentUpdate } from 'react/lib/ReactComponentWithPureRenderMixin';
import ReactDOM from 'react-dom';

import LoginForm from './components/LoginForm';
import { ajaxPost } from '../common/units/AjaxApi';

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = shouldComponentUpdate.bind(this);

    this.store = {};
    this.state = Object.assign({}, this.store);
  }

  doLogin (data, callback) {
    ajaxPost('/user/login', data, (success, data) => {
      callback && callback(success, data); 
    });
  }

  render() {
    return(
      <div className="panel panel-default" id="login-panel">
        <div className="panel-body">
          <LoginForm doLogin={this.doLogin.bind(this)} />
        </div>
      </div>
    );
  }
}
ReactDOM.render(
  <LoginPage />,
  document.getElementById('login-page')
);
