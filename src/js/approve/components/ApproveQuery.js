import React, { Component } from 'react';
import { shouldComponentUpdate } from 'react/lib/ReactComponentWithPureRenderMixin';

import FormAlert from '../../common/components/FormAlert';
import FormValidator from '../../common/units/FormValidator_';
import { STATUS } from '../../common/constants/Order';

class ApproveQuery extends Component {
  constructor (props) {
    super(props);
    this.shouldComponentUpdate = shouldComponentUpdate.bind(this);

    this.state = {
      alert: null,
      loading: false
    }
  }

  componentWillMount() {
    this.fv = new FormValidator((()=>{
      return this.state;
    }).bind(this),this.setState.bind(this));

    this.fv.setInputs({
      start_date: {
        value: '',
        validator: (value) => {
          if(value !== '' && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            return  '请输入开始日期';
          }
        }
      },
      end_date: {
        value: '',
        validator: (value) => {
          if(value !== '' && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            return  '请输入结束日期';
          }
        }
      },
      room_id: {
        value: '0',
        validator: (value) => {
          return null;
        }
      },
      status: {
        value: 'pending',
        validator: (value) => {
          return null;
        }
      },
      dept_id: {
        value: '0',
        validator: (value) => {
          return null;
        }
      },
      per_page: {
        value: '8',
        validator: (value) => {
          if (value !== '' && parseInt(value) != value) {
            return '请正确填写每页显示数';
          }
        }
      },
    });
  }

  handleChange (name, event) {
    this.fv.handleChange(name, event);
  }

  onQeury(e) {
    e && e.preventDefault();
    let fields = ['start_date','end_date','room_id', 'status', 'dept_id', 'per_page'];
    let errors = this.fv.validateInputs(fields);

    if(errors.length > 0) {
      this.setState({
        alert: {style: 'danger', text: errors[0].error}
      });
      return;
    }

    let formData = this.fv.getInputValues(fields);
    if (formData.room_id == 0){
      delete formData.room_id;
    }
    if (formData.status == 0){
      delete formData.status;
    }
    if (formData.dept_id == 0){
      delete formData.dept_id;
    }
    this.setState({
      alert: null,
      loading: true
    });
    this.props.onQeury(formData).then(data => {
      this.setState({loading: false});
    }, data => {
      this.setState({
        loading: false,
        alert: { style: 'danger', text: data.message}
      });
    });
  }

  getBsStyle (name) {
    if(!this.fv.getInputError(name)){
      return null;
    }else{
      return 'has-error';
    }
  }

  render() {
    let {roomList, rooms, deptMap, depts} = this.props;
    let deptElList = [];
    let deptHasRendered = {};
    function renderDepts(deptList, prefix) {
      if (!deptList) {
        return;
      }
      deptList.map(dept_id => {
        if (deptHasRendered.dept_id) {
          return;
        }
        let dept = depts[dept_id];
        deptElList.push(<option key={dept_id} value={dept_id}>{prefix+dept.name}</option>);
        if (deptMap[dept_id]){
          renderDepts(deptMap[dept_id], prefix+'└');
        }
      })
    }
    renderDepts(deptMap[0],'');

    return (
      <form onSubmit={this.onQeury.bind(this)} >
        <div className="row">
          <div className={'form-group col-sm-6 col-md-4 '+this.getBsStyle.call(this, 'start_date')}>
            <label className="control-label inline-label">开始日期</label>
            <div className="input-group">
              <input type="date" placeholder="开始日期" className="form-control" onChange={this.handleChange.bind(this, 'start_date')} value={this.fv.getInputValue('start_date')} />
              <span className="input-group-addon"><span className="glyphicon glyphicon-calendar" /></span>
            </div>
          </div>
          <div className={'form-group col-sm-6 col-md-4 '+this.getBsStyle.call(this, 'end_date')}>
            <label className="control-label inline-label">结束日期</label>
            <div className="input-group">
              <input type="date" placeholder="结束日期" className="form-control" onChange={this.handleChange.bind(this, 'end_date')} value={this.fv.getInputValue('end_date')} />
              <span className="input-group-addon"><span className="glyphicon glyphicon-calendar" /></span>
            </div>
          </div>
          <div className="form-group col-sm-6 col-md-4">
            <label className="control-label inline-label">申请房间</label>
            <div className="inline-control">
              <select ref="dept_id" className="form-control" onChange={this.handleChange.bind(this, 'room_id')} value={this.fv.getInputValue('room_id')}>
                <option value="0">全部</option>
                {roomList && roomList.map(room_id => {
                  let room = rooms[room_id];
                  return (<option key={room_id} value={room_id}>{room.name+'('+room.number+')'}</option>);
                })}
              </select>
            </div>
          </div>
          <div className="form-group col-sm-6 col-md-4">
            <label className="control-label inline-label">预约状态</label>
            <div className="inline-control">
              <select ref="status" className="form-control" onChange={this.handleChange.bind(this, 'status')} value={this.fv.getInputValue('status')}>
                <option value="0">全部</option>
                <option value="pending">待审批预约</option>
                <option value="approved">已通过预约</option>
                <option value="rejected">已驳回预约</option>
              </select>
            </div>
          </div>
          <div className="form-group col-sm-6 col-md-4">
            <label className="control-label inline-label">社团单位</label>
            <div className="inline-control">
              <select ref="dept_id" className="form-control" onChange={this.handleChange.bind(this, 'dept_id')} value={this.fv.getInputValue('dept_id')}>
                <option value="0">全部</option>
                {deptElList}
              </select>
            </div>
          </div>
          <div className={'form-group col-sm-6 col-md-4 '+this.getBsStyle.call(this, 'per_page')}>
            <label className="control-label inline-label">每页显示</label>
            <div className="inline-control">
              <input ref="perPage" type="text" placeholder="每页显示" className="form-control" onChange={this.handleChange.bind(this, 'per_page')} value={this.fv.getInputValue('per_page')}/>
            </div>
          </div>
          <div className="form-group col-sm-6 col-md-4 col-sm-offset-6 col-md-offset-8">
            <button type="submit" className="btn-block btn btn-primary" disabled={this.state.loading}>查找</button>
          </div>
          <div className="col-md-12">
            {this.state.alert?(<FormAlert style={this.state.alert.style} text={this.state.alert.text}/>):null}
          </div>
        </div>
      </form>
    );
  }
}

export default ApproveQuery;