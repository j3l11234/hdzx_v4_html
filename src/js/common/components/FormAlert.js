import React, { Component } from 'react';
import { shouldComponentUpdate } from 'react/lib/ReactComponentWithPureRenderMixin';

function FormAlert(props) {
  return <div className={'alert alert-'+props.style} role="alert">
    {props.text}
    {props.children}
  </div>;
}

export default FormAlert;
