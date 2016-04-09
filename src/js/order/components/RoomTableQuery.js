import React, { Component } from 'react';
import { shouldComponentUpdate } from 'react/lib/ReactComponentWithPureRenderMixin';

class RoomTableQuery extends Component {
  constructor (props) {
    super(props);
    this.shouldComponentUpdate = shouldComponentUpdate.bind(this);
  }
  
  onQeuryClick (e) {
    this.props.onQeuryClick();
    return false;
  }

  render() {
    return (
      <form>
        <div className="row">
          <div className="form-group col-sm-6 col-md-4">
            <label className="control-label inline-label">开始日期</label>
            <div className="input-group">
              <input type="date" placeholder="开始日期" className="form-control" />
              <span className="input-group-addon"><span className="glyphicon glyphicon-calendar" /></span>
            </div>
          </div>
          <div className="form-group col-sm-6 col-md-4">
            <label className="control-label inline-label">结束日期</label>
            <div className="input-group">
              <input type="date" placeholder="结束日期" className="form-control" />
              <span className="input-group-addon"><span className="glyphicon glyphicon-calendar" /></span>
            </div>
          </div>
          <div className="form-group col-sm-6 col-md-4">
            <label className="control-label inline-label">每页显示</label>
            <div className="inline-control">
              <input type="text" placeholder="每页显示" className="form-control" />
            </div>
          </div>
          <div className="form-group col-sm-6 col-md-4">
            <label className="control-label inline-label">图例</label>
            <div className="inline-control">
              <div className="rt-legend z-rt-free">正常</div>
              <div className="rt-legend z-rt-ordered">申请</div>
              <div className="rt-legend z-rt-used">占用</div>
              <div className="rt-legend z-rt-locked">锁定</div>
            </div>
          </div>
          <div className="form-group col-sm-6 col-md-4">
            <input type="button" value="查找" className="btn-block btn btn-primary" onClick={this.onQeuryClick.bind(this)}/>
          </div>
        </div>
      </form>
    );
  }
}
export default RoomTableQuery;