import React, { Component } from 'react';
import { shouldComponentUpdate } from 'react/lib/ReactComponentWithPureRenderMixin';

import HourSelect from './OrderHourSelect';
import DeptSelect from './OrderDeptSelect';
import Note from './OrderNote';
import FormAlert from '../../common/components/FormAlert';
import FormValidator from '../../common/units/FormValidator';

const NumberMap =  {
  1: '<5',
  2: '5-10',
  3: '10-50',
  4: '50-100',
  5: '>100',
}

class OrderForm extends Component {
  constructor (props) {
    super(props);
    this.shouldComponentUpdate = shouldComponentUpdate.bind(this);

    this.state = {
      alert: null,
      captchaUrl: null,
      startHour: null,
      endHour: null,
      hours: null
    }

    this.fv = new FormValidator({
      name: {
        value: '',
        validator: (value) => {
          if(value.length < 1) {
            return  '请认真填写姓名';
          }
        }
      },
      student_no: {
        value: '',
        validator: (value) => {
          if(!/^\d{8}$/.test(value)) {
            return  '学号不正确';
          }
        }
      },
      phone: {
        value: '',
        validator: (value) => {
          if(!/^\d{11}$/.test(value)) {
            return  '电话号码不正确';
          }
        }
      },
      title: {
        value: '',
        validator: (value) => {
          if(value.length < 2) {
            return  '请认真填写标题';
          }
        }
      },
      content: {
        value: '',
        validator: (value) => {
          if(value.length < 4) {
            return  '请认真填写活动内容';
          }
        }
      },
      number: {
        value: 1,
        validator: (value) => {
          if(value == 0) {
            return '请选择活动人数';
          }
        }
      },
      secure: {
        value: '',
        validator: (value) => {
          if(value.length < 4) {
            return  '请认真填写安保措施';
          }
        }
      },
      captcha: {
        value: '',
        validator: (value) => {
          if(!value) {
            return  '请输入验证码';
          }
        }
      }
    });
  }

  handleChange (name, event) {
    this.fv.handleChange(name, event);
    this.forceUpdate();
  }

  onChooseHours (startHour, endHour, hours) {
    this.setState({startHour, endHour, hours});
  }

  onCaptcha () {
    this.props.onCaptcha().then(data => {
      this.setState({
        captchaUrl: data.url
      });
    });
  }

  setValues (values) {
    this.fv.setInputValues(values);
    this.forceUpdate();
  }

  reset() {
    this.setState({
      startHour: null,
      endHour: null,
      hours: null,
      alert: null
    });
    this.refs.hourSelect.reset();
    this.onCaptcha();
  }

  onSubmit() {
    this.fv.validateAll();
    let error = this.fv.getFirstError();
    if(error) {
      this.setState({
        alert: {style: 'danger', text: error}
      });
      return;
    }
    if(!this.refs.deptSelect.valadate()){
      this.setState({
        alert: { style: 'danger', text: '请正确选择社团单位'}
      });
      return;
    }

    if (!this.state.hours) {
      this.setState({
        alert: { style: 'danger', text: '请选择预约时段'}
      });
      return;
    }
    let formData = this.fv.getFormData();
    formData = Object.assign(formData, {
      number: NumberMap[formData.number],
      room_id: this.props.room_id,
      date: this.props.date,
      hours: JSON.stringify(this.state.hours),
      dept_id: this.refs.deptSelect.getSelect(),
    });

    this.setState({alert: null});
    console.log('aaa');
    this.props.onSubmit(formData).then(data => {
      this.setState({
        alert: { style: 'success', text: data.message}
      });
    } , data => {
      this.setState({
        alert: { style: 'danger', text: data.message}
      });
      this.updateCaptcha();
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
    let {room, hourTable, date, depts, deptMap} = this.props;
    let { startHour, endHour } = this.state;
    let roomName = room.number+' - '+room.name;
    hourTable = hourTable ? hourTable : [];

    return (
      <form>
        <div className="row">
          <div className="col-sm-6">
            <HourSelect ref="hourSelect" hourTable={hourTable} maxHour={room.max_hour} onChooseHours={this.onChooseHours.bind(this)}/>
          </div>
          <div className="col-sm-6">
            <Note ref="note" date={date} roomName={roomName} startHour={startHour} endHour={endHour} maxHour={room.max_hour}/>
          </div>
          <div className="clearfix" />
          <div className={'form-group col-sm-6 '+this.getBsStyle.call(this, 'name')}>
            <label className="control-label inline-label">姓名</label>
            <div className="inline-control">
              <input type="text" placeholder="姓名" className="form-control" value={this.fv.getInputValue('name')} onChange={this.handleChange.bind(this, 'name')} />
            </div>
          </div>
          <div className={'form-group col-sm-6 '+this.getBsStyle.call(this, 'student_no')}>
            <label className="control-label inline-label">学号</label>
            <div className="inline-control">
              <input type="text" placeholder="学号" className="form-control" value={this.fv.getInputValue('student_no')} onChange={this.handleChange.bind(this, 'student_no')} />
            </div>
          </div>
          <div className={'form-group col-sm-6 '+this.getBsStyle.call(this, 'phone')}>
            <label className="control-label inline-label">联系方式</label>
            <div className="inline-control">
              <input type="text" placeholder="联系方式" className="form-control" value={this.fv.getInputValue('phone')} onChange={this.handleChange.bind(this, 'phone')} />
            </div>
          </div>
          <div className={'form-group col-sm-6 '+this.getBsStyle.call(this, 'number')}>
            <label className="control-label inline-label">活动人数</label>
            <div className="inline-control">
              <select className="form-control" onChange={this.handleChange.bind(this, 'number')} value={this.fv.getInputValue('number')}>
                <option value="0">请选择</option>
                <option value="1">&lt;5</option>
                <option value="2">5-10</option>
                <option value="3">10-50</option>
                <option value="4">50-100</option>
                <option value="5">&gt;100</option>
              </select>
            </div>
          </div>

          <div className={'form-group col-sm-12 '}>
            <label className="control-label inline-label">社团单位</label>
            <DeptSelect ref="deptSelect" depts={depts} deptMap={deptMap} />
          </div>

          <div className={'form-group col-sm-12 '+this.getBsStyle.call(this, 'title')}>
            <label className="control-label inline-label">活动主题</label>
            <div className="inline-control">
              <input type="text" placeholder="请填写活动主题" className="form-control" value={this.fv.getInputValue('title')} onChange={this.handleChange.bind(this, 'title')} />
            </div>
          </div>
          <div className={'form-group col-sm-12 '+this.getBsStyle.call(this, 'content')}>
            <label className="control-label inline-label">活动内容</label>
            <div className="inline-control">
              <textarea placeholder="请填写活动内容" className="form-control" value={this.fv.getInputValue('content')} onChange={this.handleChange.bind(this, 'content')} />
            </div>
          </div>
          
          <div className={'form-group col-sm-12 '+this.getBsStyle.call(this, 'secure')}>
            <label className="control-label inline-label">安保措施</label>
            <div className="inline-control">
              <textarea placeholder="请填写安保措施" className="form-control" value={this.fv.getInputValue('secure')} onChange={this.handleChange.bind(this, 'secure')} />
            </div>
          </div>
          <div className={'form-group col-sm-6 '+this.getBsStyle.call(this, 'captcha')}>
            <label className="control-label inline-label">验证码</label>
            <div className="inline-control">
              <input type="text" placeholder="验证码" className="form-control" value={this.fv.getInputValue('captcha')} onChange={this.handleChange.bind(this, 'captcha')} />
            </div>
          </div>
          <div className="col-sm-6">
            {this.state.captchaUrl ? (<img src={this.state.captchaUrl} alt="验证码" onClick={this.onCaptcha.bind(this)}/>) : null}
          </div>
          <div className="col-sm-12">
            {this.state.alert?(<FormAlert style={this.state.alert.style} text={this.state.alert.text}/>):null}
          </div>
        </div>      
      </form>
    );
  }
}

export default OrderForm;