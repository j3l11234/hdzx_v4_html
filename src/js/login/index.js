import '../common/Polyfills';
import React, { Component } from 'react';
import { shouldComponentUpdate } from 'react/lib/ReactComponentWithPureRenderMixin';
import update from 'react/lib/update';
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

  componentWillMount() {
    ServerApi.Data.getData('login', this.props.type).then(data => {
      let {  tooltip } = data;
      this.store = update(this.store, {
        tooltip: {$set: tooltip}
      });
      this.setState(this.store);
      return data;
    });
  }

  doLogin(data) {
    return ServerApi.User.login(data);
  }

  render() {
    let { tooltip } = this.state;
    return(
      <div className="panel panel-default" id="login-panel">
        <div className="panel-body">
          <LoginForm onLogin={this.doLogin.bind(this)} />
          {tooltip ? <div key='tooltip' dangerouslySetInnerHTML={{__html: tooltip}} /> : null}
        </div>
      </div>
    );
  }
}
ReactDOM.render(
  <LoginPage />,
  document.getElementById('login-page')
);
