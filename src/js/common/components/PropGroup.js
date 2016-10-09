import React from 'react';

function PropGroup(props) {
  let { groupClassName, label, content } = props;
  groupClassName = groupClassName ? groupClassName : '';

  return (
    <div className={'form-group ' + groupClassName}>
      <label className="prop-label">{label}</label>
      <span className="prop-content">{content}</span>
    </div>
  );
}


export default PropGroup;
