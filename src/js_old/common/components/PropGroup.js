import React, { Component } from 'react';
import {shouldComponentUpdate} from 'react-addons-pure-render-mixin';
import { Alert, Input, ButtonInput } from 'react-bootstrap';


class PropGroup extends Component {
  constructor (props) {
    super(props);
    this.shouldComponentUpdate = shouldComponentUpdate.bind(this);
  }

  render() {
    let { groupClassName, label, content } = this.props;
    groupClassName = groupClassName ? groupClassName : '';

    return (
      <div className={'form-group ' + groupClassName}>
        <label className="prop-label">{label}</label>
        <span className="prop-content">{content}</span>
      </div>
    );
  }
}



export default PropGroup;
