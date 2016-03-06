import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Panel } from 'react-bootstrap';

import * as ServerApi from '../helpers/ServerApi';
import * as UserActions from '../actions/UserActions';
import LoginForm from '../components/loginForm';

class LoginPage extends Component {
  doLogin(username, password, remenber_me, callback) {
    const { dispatch } = this.props;

    ServerApi.user_login(dispatch, username, password, remenber_me).then(data => {
      const { user } = data;
      dispatch(UserActions.login(user));
      callback && callback(true, data);
    },error => {
      callback && callback(false, error);
    });
  }

  render() {
    return (
      <Panel bsClass="panel" id="login-panel">
        <LoginForm login={this.props.login} doLogin={this.doLogin.bind(this)} />
      </Panel>
    );
  }
}

export default connect(state => ({
}))(LoginPage);