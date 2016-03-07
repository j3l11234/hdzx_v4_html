import React, { Component } from 'react';
import {shouldComponentUpdate} from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import { Nav, Navbar, NavDropdown, NavItem, MenuItem } from 'react-bootstrap';

import * as ServerApi from '../helpers/ServerApi';
import * as UserActions from '../actions/UserActions';
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
          <a href="/">学活场地申请系统</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <NavItem eventKey={1} href="#/order">房间预约</NavItem>
            <NavItem eventKey={2} href="#">预约查询</NavItem>
            <NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
              <MenuItem eventKey={3.1}>Action</MenuItem>
              <MenuItem eventKey={3.2}>Another action</MenuItem>
              <MenuItem eventKey={3.3}>Something else here</MenuItem>
              <MenuItem divider />
              <MenuItem eventKey={3.3}>Separated link</MenuItem>
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