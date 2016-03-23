import React, { Component } from 'react';
import {shouldComponentUpdate} from 'react-addons-pure-render-mixin';
import { MenuItem, NavDropdown } from 'react-bootstrap';

class NavUser extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = shouldComponentUpdate.bind(this);
  }

  onLogoutClick() {
    this.props.doLogout(data => console.log(data));
  }
  
  render() {
    if(this.props.user){
      return (
        <NavDropdown eventKey={1} title={this.props.user.alias} id="basic-nav-dropdown">
          <MenuItem eventKey={1.1}>个人中心</MenuItem>
          <MenuItem eventKey={1.2} onClick={this.onLogoutClick.bind(this)}>注销</MenuItem>
        </NavDropdown>
      );
    }else{
      return (
        <NavDropdown eventKey={1} title="未登录" id="basic-nav-dropdown">
          <MenuItem eventKey={1.1} href="#/login">登录</MenuItem>
        </NavDropdown>
      );
    }
    
  }
};

export default NavUser;
