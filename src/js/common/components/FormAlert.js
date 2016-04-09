import React, { Component } from 'react';
import { shouldComponentUpdate } from 'react/lib/ReactComponentWithPureRenderMixin';

class FormAlert extends Component {
  constructor (props) {
    super(props);
    this.shouldComponentUpdate = shouldComponentUpdate.bind(this);
  }

  render() {
    let { text, style} = this.props;

    return (
      <div className={'alert alert-'+style} role="alert">
        {text}
        {this.props.children}
      </div>
    );
  }
}

export default FormAlert;
