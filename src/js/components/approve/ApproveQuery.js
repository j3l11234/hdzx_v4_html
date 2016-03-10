import React, { Component } from 'react';
import {shouldComponentUpdate} from 'react-addons-pure-render-mixin';
import { ButtonInput, Input, Glyphicon } from 'react-bootstrap';

class ApproveQuery extends Component {
  constructor (props) {
    super(props);
    this.shouldComponentUpdate = shouldComponentUpdate.bind(this);
  }
  
  onQeuryClick (e) {
    let type = this.props.type;
    this.props.onQeuryClick(type);
    return false;
  }

  render() {
    let { depts, deptList } = this.props;
    
    return (
      <form>
        <div className="row">
          <Input type="text" groupClassName="col-sm-6 col-md-4" label="开始日期" labelClassName="inline-label" placeholder="开始日期" addonAfter={<Glyphicon glyph="calendar" />} />
          <Input type="text" groupClassName="col-sm-6 col-md-4" label="结束日期" labelClassName="inline-label" placeholder="结束日期" addonAfter={<Glyphicon glyph="calendar" />} />
          <Input type="select" groupClassName="col-sm-6 col-md-4" label="状态筛选" labelClassName="inline-label" placeholder="类型筛选" wrapperClassName="inline-control" >
            <option value="1">待审批预约</option>
            <option value="2">已通过预约</option>
            <option value="3">已驳回预约</option>
            <option value="0">全部</option>
          </Input>
          <Input type="select" groupClassName="col-sm-6 col-md-4" label="社团单位" labelClassName="inline-label" placeholder="社团单位" wrapperClassName="inline-control">
            <option value="0">全部</option>
            {
              deptList.map(dept_id => {
                let dept = depts[dept_id];
                return (
                  <option key={dept_id} value={dept_id}>{dept.name}</option>
                );
              })
            }
          </Input>
          <Input type="text" groupClassName="col-sm-6 col-md-4" label="每页显示" labelClassName="inline-label" placeholder="每页显示" wrapperClassName="inline-control" />
          <ButtonInput type="button" bsStyle="primary" groupClassName="col-sm-6 col-md-4" value="查找" block onClick={this.onQeuryClick.bind(this)}/>
        </div>
      </form>
    );
  }
}

export default ApproveQuery;