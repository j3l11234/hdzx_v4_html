import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Panel } from 'react-bootstrap';

import * as UserActions from '../actions/UserActions';
import LoginForm from '../components/loginForm';

class LoginPage extends Component {
  doLogin(username, password, remenber_me, callback) {
    const { dispatch } = this.props;

    dispatch(UserActions.login(username, password, remenber_me, callback));
    
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