import React, { Component } from 'react';
import { shouldComponentUpdate } from 'react-addons-pure-render-mixin';
import { ButtonInput, Input, Glyphicon } from 'react-bootstrap';

class OrderNote extends Component {
  constructor (props) {
    super(props);
    this.shouldComponentUpdate = shouldComponentUpdate.bind(this);
  }

  render() {
    let {date, roomName, maxHour, startHour, endHour} = this.props;
    return (
      <div className="note">
        <div className="note-row">
          <label className="note-label">日期：</label>
          <div className="note-content">{date}</div>
        </div>
        <div className="note-row">
          <label className="note-label">房间：</label>
          <div className="note-content">{roomName}</div>
        </div>
        <div className="note-row">
          <label className="note-label">时段：</label>
          <div className="note-content">从<span className="note-hour">{startHour ? startHour : ''}</span>时到<span className="note-hour">{endHour ? endHour : ''}</span>时(最长<span>{maxHour}</span>小时)</div>
        </div>
        <div className="note-row">
          <label className="note-label">图例：</label>
          <div className="note-content">
            <div className="note-legend z-rt-free">正常</div>
            <div className="note-legend z-rt-choosen">选中</div>
            <div className="note-legend z-rt-ordered">申请</div>
            <div className="note-legend z-rt-used">占用</div>
            <div className="note-legend z-rt-locked">锁定</div>
          </div>
        </div>
      </div>
    );
  }
}

export default OrderNote;