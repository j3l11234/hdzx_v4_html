import '../common/Polyfills';
import React, { Component } from 'react';
import { shouldComponentUpdate } from 'react/lib/ReactComponentWithPureRenderMixin';
import ReactDOM from 'react-dom';

import LoginForm from './components/LoginForm';
import * as ServerApi from '../common/units/ServerApi';

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = shouldComponentUpdate.bind(this);

    this.store = {};
    this.state = this.store;
  }

  doLogin(data) {
    return ServerApi.User.login(data);
  }

  render() {
    return(
      <div className="panel panel-default" id="login-panel">
        <div className="panel-body">
          <LoginForm onLogin={this.doLogin.bind(this)} />
        </div>
      </div>
    );
  }
}
ReactDOM.render(
  <LoginPage />,
  document.getElementById('login-page')
);
