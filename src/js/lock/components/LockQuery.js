import React, { Component } from 'react';
import { shouldComponentUpdate } from 'react/lib/ReactComponentWithPureRenderMixin';

import FormAlert from '../../common/components/FormAlert';
import { STATUS } from '../../common/constants/LockStatus';

class LockQuery extends Component {
  constructor (props) {
    super(props);
    this.shouldComponentUpdate = shouldComponentUpdate.bind(this);

    this.state = {
      alert: null,
      loading: false
    }

  }

  onQeury(e) {
    e && e.preventDefault();

    this.setState({alert: null});
    this.setState({loading: true});

    this.props.onQeury((success, data) => {
      this.setState({loading: false});
      if (success) {

      }else{
        this.setState({
          alert: { style: 'danger', text: data.message}
        });
      }
    });
  }

  onFilterClick(e) {
    let start_date = this.refs.start_date.value;
    let end_date = this.refs.end_date.value;
    let status = parseInt(this.refs.status.value);
    let perPage = parseInt(this.refs.perPage.value);
    let room_id = parseInt(this.refs.room_id.value);

    this.props.onFilter({
      start_date,
      end_date,
      status,
      perPage,
      room_id
    });
  }

  onAddClick(e){
    this.props.onAddClick();
  }

  getBsStyle (name) {
    if(!this.fv.getInputError(name)){
      return null;
    }else{
      return 'has-error';
    }
  }

  render() {
    let { rooms, roomList } = this.props;
    return (
      <form onSubmit={this.onQeury.bind(this)} >
        <div className="row">
          <div className="form-group col-sm-6 col-md-4">
            <button type="submit" className="btn-block btn btn-primary" disabled={this.state.loading}>查找</button>
          </div>
          <div className="form-group col-sm-6 col-md-4">
            <button type="button" className="btn-block btn btn-success" onClick={this.onAddClick.bind(this)}>新增房间锁</button>
          </div>
          <div className="col-md-12">
            {this.state.alert?(<FormAlert style={this.state.alert.style} text={this.state.alert.text}/>):null}
          </div>
          <div className="col-sm-12">
            <hr className="small" />
          </div>
          <div className="form-group col-sm-6 col-md-4">
            <label className="control-label inline-label">开始日期</label>
            <div className="input-group">
              <input ref="start_date" type="date" placeholder="开始日期" className="form-control" />
              <span className="input-group-addon"><span className="glyphicon glyphicon-calendar" /></span>
            </div>
          </div>
          <div className="form-group col-sm-6 col-md-4">
            <label className="control-label inline-label">结束日期</label>
            <div className="input-group">
              <input ref="end_date" type="date" placeholder="结束日期" className="form-control" />
              <span className="input-group-addon"><span className="glyphicon glyphicon-calendar" /></span>
            </div>
          </div>
          <div className="form-group col-sm-6 col-md-4">
            <label className="control-label inline-label">锁状态</label>
            <div className="inline-control">
              <select ref="status" className="form-control" defaultValue="0">
                <option value="0">全部</option>
                <option value={STATUS.ENABLE}>启用</option>
                <option value={STATUS.DISABLE}>未启用</option>
              </select>
            </div>
          </div>
          <div className="form-group col-sm-6 col-md-4">
            <label className="control-label inline-label">锁定房间</label>
            <div className="inline-control">
              <select ref="room_id" className="form-control" defaultValue="0">
                <option value="0">全部</option>
                {
                  roomList && roomList.map(room_id => {
                    let room = rooms[room_id];
                    return (
                      <option key={room_id} value={room_id}>{room.name+'('+room.number+')'}</option>
                    );
                  })
                }
              </select>
            </div>
          </div>
          <div className="form-group col-sm-6 col-md-4">
            <label className="control-label inline-label">每页显示</label>
            <div className="inline-control">
              <input ref="perPage" type="text" placeholder="每页显示" className="form-control" defaultValue="8" />
            </div>
          </div>
          <div className="form-group col-sm-6 col-md-4">
            <button type="button" className="btn-block btn btn-success" onClick={this.onFilterClick.bind(this)}>筛选</button>
          </div>
        </div>
      </form>
    );
  }
}

export default LockQuery;