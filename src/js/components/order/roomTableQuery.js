import React, { Component } from 'react';
import {shouldComponentUpdate} from 'react-addons-pure-render-mixin';
import { ButtonInput, Input, Glyphicon } from 'react-bootstrap';

class RoomTableQuery extends Component {
  constructor (props) {
    super(props);
    this.shouldComponentUpdate = shouldComponentUpdate.bind(this);
  }
  
  render() {
    return (
      <form>
        <div className="row">
          <Input type="text" groupClassName="col-sm-6 col-md-4" label="开始日期" labelClassName="inline-label" placeholder="开始日期" addonAfter={<Glyphicon glyph="calendar" />} />
          <Input type="text" groupClassName="col-sm-6 col-md-4" label="结束日期" labelClassName="inline-label" placeholder="结束日期" addonAfter={<Glyphicon glyph="calendar" />} />
          <Input type="text" groupClassName="col-sm-6 col-md-4" label="每页显示" labelClassName="inline-label" placeholder="每页显示" wrapperClassName="inline-control" />
          <ButtonInput type="submit" bsStyle="primary" groupClassName="col-sm-6 col-md-4" value="查找" block />
        </div>
      </form>
    );
  }
}

export default RoomTableQuery;