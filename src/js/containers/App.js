import React, { Component } from 'react';
import {shouldComponentUpdate} from 'react-addons-pure-render-mixin';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as AppActions from '../actions/AppActions';
import NavBar from './NavBar';

class App extends Component {
	constructor(props) {
    super(props);
    this.shouldComponentUpdate = shouldComponentUpdate.bind(this);
  }

	componentDidMount() {
    const { dispatch } = this.props;
    dispatch(AppActions.getInitData());
  }
  render() {
    const { children } = this.props;
    return (
      <div className="container">
        <NavBar />
        {children}
      </div>
    );
  }
};

export default connect(state => ({}))(App);
