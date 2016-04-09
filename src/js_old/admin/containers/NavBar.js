import React, { Component } from 'react';
import {shouldComponentUpdate} from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import { Nav, Navbar, NavDropdown, NavItem, MenuItem } from 'react-bootstrap';

import * as ServerApi from '../../common/helpers/ServerApi';
import * as UserActions from '../../common/actions/UserActions';
import NavUser from '../components/NavUser';

class Navbar_ extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = shouldComponentUpdate.bind(this);
  }
  
  doLogout(callback) {
    const { dispatch } = this.props;

    ServerApi.user_logout(dispatch).then(data => {
      dispatch(UserActions.logout());
      callback && callback(true, data);
    },error => {
      callback && callback(false, error);
    });
  }

  render() {
    return (
      <Navbar inverse fluid={true}>
        <Navbar.Header>
          <Navbar.Brand>
          <a href="/">学活场地后台管理系统</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <NavDropdown eventKey={1} title="预约审批" id="basic-nav-dropdown">
              <MenuItem eventKey={1.1} href="#/approve/manager">负责人审批</MenuItem>
              <MenuItem eventKey={1.1} href="#/approve/school">校级审批</MenuItem>
              <MenuItem eventKey={1.3} href="#/approve/auto">自动审批</MenuItem>
            </NavDropdown>
          </Nav>
          <Nav pullRight>
            <NavUser user={this.props.user} doLogout={this.doLogout.bind(this)} />
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
};

export default connect(state => ({
  user: state.user,
}))(Navbar_);