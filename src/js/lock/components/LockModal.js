import React, { Component } from 'react';
import { shouldComponentUpdate } from 'react/lib/ReactComponentWithPureRenderMixin';

import RoomSelect from './LockRoomSelect';
import FormAlert from '../../common/components/FormAlert';
import FormValidator from '../../common/units/FormValidator';
import { STATUS, LOOP, WEEKDAY } from '../../common/constants/LockStatus';

class LockModal extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = shouldComponentUpdate.bind(this);

    this.state = {
      loading: false,
    }

    this.fv = new FormValidator({
      title: {
        value: '',
        validator: (value) => {
          if(value == ''){
            return '请输入锁标题';
          }
        }
      },
      loop_type: {
        value: LOOP.DAY,
      },
      loop_day: {
        value: '',
        validator: (value) => {
          let loop_type = this.fv.getInputValue('loop_type');
          if(loop_type == LOOP.DAY) {
            return null;
          }
          if(value == ''){
            return "请输入循环日";
          }
          let val = parseInt(value);
          if(loop_type == LOOP.WEEK && (val < 0 || val > 6)) {
            return "循环日范围为(0 - 6)";
          } else if(loop_type == LOOP.MONTH && (val < 1 || val > 31)) {
            return "循环日范围为(1 - 31)";
          }
          return null;
        }
      },
      start_date: {
        value: '',
        validator: (value) => {
          if(!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            return  '请输入开始日期';
          }
        }
      },
      end_date: {
        value: '',
        validator: (value) => {
          if(!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            return  '请输入结束日期';
          }
        }
      },
      status: {
        value: STATUS.ENABLE,
      },
      start_hour: {
        value: '',
        validator: (value) => {
          if (!/^\d*$/.test(value)) {
            return  '请输入开始时间';
          } else {
            value = parseInt(value);
            if(value < 8 || value > 21) {
              return '开始时间在8-21之间';
            }
          }
        }
      },
      end_hour: {
        value: '',
        validator: (value) => {
          if (!/^\d*$/.test(value)) {
            return  '请输入结束时间';
          } else {
            value = parseInt(value);
            if(value < 9 || value > 22) {
              return '结束时间在9-22之间';
            }
          }
        }
      },
      comment: {
        value: '',
      }
    });
  }

  componentWillReceiveProps(nextProps){
    console.log(nextProps);
    if(this.props.lock !== nextProps.lock) {
      if(nextProps.mode == 'edit') {
        let lock = nextProps.lock;
        let startHour = parseInt(lock.hours[0]);
        let endHour = parseInt(lock.hours[lock.hours.length -1])+1;
        this.fv.setInputValues({
          title: lock.title,
          loop_type: lock.loop_type,
          loop_day: lock.loop_day,
          start_date: lock.start_date,
          end_date: lock.end_date,
          status: lock.status,
          start_hour: startHour,
          end_hour: endHour,
          comment: lock.comment,
        });
        this.refs.roomselect.setRooms(lock.rooms);
      } else {
        this.fv.setInputValues({
          title: '',
          loop_type: LOOP.DAY,
          loop_day: '',
          start_date: '',
          end_date: '',
          status: STATUS.ENABLE,
          start_hour: '',
          end_hour: '',
          comment: '',
        });
        this.refs.roomselect.setRooms([]);
      }
    }
  }

  handleChange (name, event) {
    this.fv.handleChange(name, event);
    this.forceUpdate();
  }

  onLoopTypeChange(){
    this.setState({ loop_type: this.refs.loop_type.value });
  }

  showModal() {
    this.setState({ loading: false });
    $(this.refs.modal).modal('show');
  }

  onSubmit() {
    let { operation, lock } = this.props;

    this.fv.validateAll();
    let error = this.fv.getFirstError();
    if(error) {
      this.setState({
        alert: {style: 'danger', text: error}
      });
      return;
    }

    let formData = this.fv.getFormData();
    formData.order_id = lock.id;

    this.setState({loading: true});
    this.props.onSubmit(operation, formData, (success, data) => {
      if(success){
        this.setState({
          alert: { style: 'success', text: data.message}
        });
      } else {
        this.setState({loading: false});
        this.setState({
          alert: { style: 'danger', text: data.message}
        });
      }
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
    let { mode, lock, roomList, rooms } = this.props;
    let { loading } = this.state;
    lock = lock ? lock : {};

    let startHour,endHour
    if(lock.hours){
      startHour = parseInt(lock.hours[0]);
      endHour = parseInt(lock.hours[lock.hours.length -1])+1;
    }
    
    let title = "";
    if(mode == 'add') {
      title = '新增房间锁';
    } else if(mode == 'edit') {
      title = '编辑房间锁';
    }

    return (
      <div ref="modal" className="modal fade" data-backdrop="static">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 className="modal-title">{title}</h4>
            </div>
            <div className="modal-body">
              <form>
                <div className="row">
                  <div className={'form-group col-sm-12 '+this.getBsStyle.call(this, 'title')}>
                    <label className="control-label inline-label">锁标题</label>
                    <div className="inline-control">
                      <input type="text" placeholder="锁标题" className="form-control" onChange={this.handleChange.bind(this, 'title')} value={this.fv.getInputValue('title')} />
                    </div>
                  </div>
                  <div className="form-group col-sm-6">
                    <label className="control-label inline-label">循环类型</label>
                    <div className="inline-control">
                      <select ref="loop_type" className="form-control" onChange={this.handleChange.bind(this, 'loop_type')} value={this.fv.getInputValue('loop_type')}>
                        <option value={LOOP.DAY}>日循环</option>
                        <option value={LOOP.WEEK}>周循环</option>
                        <option value={LOOP.MONTH}>月循环</option>
                      </select>
                    </div>
                  </div>
                  <div className={'form-group col-sm-6 '+this.getBsStyle.call(this, 'loop_day')}>
                    <label className="control-label inline-label">循环日</label>
                    <div className="inline-control">
                      <input type="text" placeholder="" className="form-control" disabled={this.fv.getInputValue('loop_type') == LOOP.DAY} onChange={this.handleChange.bind(this, 'loop_day')} value={this.fv.getInputValue('loop_type') == LOOP.DAY ? '' : this.fv.getInputValue('loop_day')} />
                    </div>
                  </div>
                  <div className={'form-group col-sm-6 '+this.getBsStyle.call(this, 'start_date')}>
                    <label className="inline-label">开始日期</label>
                    <div className="inline-control">
                      <input type="date" placeholder="开始日期" className="form-control" onChange={this.handleChange.bind(this, 'start_date')} value={this.fv.getInputValue('start_date')} />
                    </div>
                  </div>
                  <div className={'form-group col-sm-6 '+this.getBsStyle.call(this, 'end_date')}>
                    <label className="inline-label">结束日期</label>
                    <div className="inline-control">
                      <input type="date" placeholder="结束日期" className="form-control" onChange={this.handleChange.bind(this, 'end_date')} value={this.fv.getInputValue('end_date')} />
                    </div>
                  </div>
                  <div className="form-group col-sm-6">
                    <label className="inline-label">是否启用</label>
                    <div className="inline-control">
                      <select className="form-control" onChange={this.handleChange.bind(this, 'status')} value={this.fv.getInputValue('status')} >
                        <option value={STATUS.ENABLE}>启用</option>
                        <option value={STATUS.DISABLE}>未启用</option>
                      </select>
                    </div>
                  </div>
                  <div className={'form-group col-sm-6 '+this.getBsStyle.call(this, 'start_hour')+' '+this.getBsStyle.call(this, 'end_hour')}>
                    <label className="inline-label">锁定时段</label>
                    <div className="inline-control" style={{verticalAlign: 'middle'}}>
                      <input ref="start_hour" type="text" className="form-control" onChange={this.handleChange.bind(this, 'start_hour')} value={this.fv.getInputValue('start_hour')} />
                    </div>
                    <div className="inline-control text-center" style={{verticalAlign: 'middle'}}>-</div>
                    <div className="inline-control" style={{verticalAlign: 'middle'}}>
                      <input ref="end_hour" type="text" className="form-control" onChange={this.handleChange.bind(this, 'end_hour')} value={this.fv.getInputValue('end_hour')} />   
                    </div>
                  </div>
                  <div className={'form-group col-sm-12 '+this.getBsStyle.call(this, 'comment')}>
                    <label className="control-label inline-label">备注信息</label>
                    <div className="inline-control">
                      <input type="text" placeholder="备注信息" className="form-control" onChange={this.handleChange.bind(this, 'comment')} value={this.fv.getInputValue('comment')} />
                    </div>
                  </div>
                  <div className="col-sm-12">
                  {
                    this.state.alert ? (<FormAlert style={this.state.alert.style} text={this.state.alert.text}/>) : null
                  }
                  </div>
                </div>
                <RoomSelect ref="roomselect" rooms={rooms} roomList={roomList} />
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal">关闭</button>
              <button type="button" className="btn btn-success" disabled={loading} onClick={this.onSubmit.bind(this)}>提交</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LockModal;