import React, { Component } from 'react';
import { shouldComponentUpdate } from 'react/lib/ReactComponentWithPureRenderMixin';

import HourSelect from './OrderHourSelect';
import DeptSelect from './OrderDeptSelect';
import Note from './OrderNote';
import FormValidator from '../../common/units/FormValidator_';
import { range2Hours } from '../../common/units/Helpers';


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
      captchaUrl: null,
      hours: null
    }   
  }

  componentWillMount() {
    this.fv = new FormValidator((()=>{
      return this.state;
    }).bind(this),this.setState.bind(this));
    this.fv.setInputs({
      hour: (value) => {
        if (!value) {
          return '请选择申请时段';
        }
        let {start_hour, end_hour} = value;
        if (!start_hour || !end_hour) {
          return '请选择申请时段';
        }
      },
      name: {
        value: '',
        validator: (value) => {
          if(!value || value.length < 2) {
            return  '请正确填写姓名';
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
            return  '请正确填写联系方式';
          }
        }
      },
      title: {
        value: '',
        validator: (value) => {
          if(!value || value.length < 2) {
            return  '请正确填写标题';
          }
        }
      },
      content: {
        value: '',
        validator: (value) => {
          if(!value || value.length < 4) {
            return  '请正确填写活动内容';
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
          if(!value || value.length < 4) {
            return  '请正确填写安保措施';
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
      },
      prin_student: (value) => {
        if(!value ||　value.length < 2) {
          return  '请输入负责学生姓名';
        }
      },
      prin_student_phone: (value) => {
        if(!/^\d{11}$/.test(value)) {
          return  '请输入负责学生电话';
        }
      },
      prin_teacher: (value) => {
        if(!value ||　value.length < 2) {
          return  '请输入负责老师姓名';
        }
      },
      prin_teacher_phone: (value) => {
        if(!/^\d{11}$/.test(value)) {
          return  '请输入负责老师电话';
        }
      },
      activity_type: (value) => {
        if(!value ||　value.length < 2) {
          return  '请输入活动类型';
        }
      },
      need_media: (value) => {
      }
    });
  }

  onHoursChange (start_hour, end_hour) {
    this.fv.setInputValue('hour', {start_hour, end_hour}, true);
  }

  onCaptcha () {
    this.props.onCaptcha().then(data => {
      this.setState({
        captchaUrl: data.url
      });
    });
  }

  setValues (values) {
    this.fv.setInputValues(values, true);
  }

  reset() {
    this.setState({
      alert: null
    });
    this.refs.hourSelect.reset();
    this.onCaptcha();
  }

  onSubmit() {
    let { date, room, onAlert } = this.props;
    let fields = ['hour','name','student_no','phone','title','content','number','secure','captcha'].concat(
      room.need_paper == 1 ? ['prin_student', 'prin_student_phone', 'prin_teacher', 'prin_teacher_phone', 'activity_type', 'need_media'] : []);
    console.log(fields);
    let errors = this.fv.validateInputs(fields);
    if(errors.length > 0) {
      onAlert({style: 'danger', text: errors[0].error});
      return;
    }
    if(!this.refs.deptSelect.valadate()){
      onAlert({style: 'danger', text: '请选择社团单位'});
      return;
    }

    let formData = this.fv.getInputValues(fields);
    let {start_hour, end_hour} = formData.hour;
    delete formData.hour;
    formData = Object.assign(formData, {
      number: NumberMap[formData.number],
      room_id: room.id,
      date: date,
      hours: JSON.stringify(range2Hours(start_hour, end_hour)),
      dept_id: this.refs.deptSelect.getSelect(),
    });

    this.setState({alert: null});
    this.props.onSubmit(formData).then(null, data => {
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
    let { start_hour, end_hour } = this.fv.getInputValue('hour', {start_hour:null, end_hour:null});
    let roomName = room.number+' - '+room.name;
    hourTable = hourTable ? hourTable : [];

    return (
      <form>
        <div className="row">
          <div className="col-sm-6">
            <HourSelect ref="hourSelect" hourTable={hourTable} maxHour={room.max_hour}
              onChooseHours={this.onHoursChange.bind(this)}/>
          </div>
          <div className="col-sm-6">
            <Note ref="note" date={date} roomName={roomName} start_hour={start_hour} end_hour={end_hour} maxHour={room.max_hour}/>
          </div>
          <div className="clearfix" />
          <div className={'form-group col-sm-6 '+this.getBsStyle.call(this, 'name')}>
            <label className="control-label inline-label">姓名</label>
            <div className="inline-control">
              <input type="text" placeholder="姓名" className="form-control" value={this.fv.getInputValue('name')} onChange={this.fv.handleChange.bind(this.fv, 'name')} />
            </div>
          </div>
          <div className={'form-group col-sm-6 '+this.getBsStyle.call(this, 'student_no')}>
            <label className="control-label inline-label">学号</label>
            <div className="inline-control">
              <input type="text" placeholder="学号" className="form-control" value={this.fv.getInputValue('student_no')} onChange={this.fv.handleChange.bind(this.fv, 'student_no')} />
            </div>
          </div>
          <div className={'form-group col-sm-6 '+this.getBsStyle.call(this, 'phone')}>
            <label className="control-label inline-label">联系方式</label>
            <div className="inline-control">
              <input type="phone" placeholder="联系方式" className="form-control" value={this.fv.getInputValue('phone')} onChange={this.fv.handleChange.bind(this.fv, 'phone')} />
            </div>
          </div>
          <div className={'form-group col-sm-6 '+this.getBsStyle.call(this, 'number')}>
            <label className="control-label inline-label">活动人数</label>
            <div className="inline-control">
              <select className="form-control" onChange={this.fv.handleChange.bind(this.fv, 'number')} value={this.fv.getInputValue('number')}>
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
              <input type="text" placeholder="请填写活动主题" className="form-control" value={this.fv.getInputValue('title')} onChange={this.fv.handleChange.bind(this.fv, 'title')} />
            </div>
          </div>
          <div className={'form-group col-sm-12 '+this.getBsStyle.call(this, 'content')}>
            <label className="control-label inline-label">活动内容</label>
            <div className="inline-control">
              <textarea placeholder="请填写活动内容" className="form-control" value={this.fv.getInputValue('content')} onChange={this.fv.handleChange.bind(this.fv, 'content')} />
            </div>
          </div>
          
          <div className={'form-group col-sm-12 '+this.getBsStyle.call(this, 'secure')}>
            <label className="control-label inline-label">安保措施</label>
            <div className="inline-control">
              <textarea placeholder="请填写安保措施" className="form-control" value={this.fv.getInputValue('secure')} onChange={this.fv.handleChange.bind(this.fv, 'secure')} />
            </div>
          </div>
          <div className={'form-group col-sm-6 '+this.getBsStyle.call(this, 'captcha')}>
            <label className="control-label inline-label">验证码</label>
            <div className="inline-control">
              <input type="text" placeholder="验证码" className="form-control" value={this.fv.getInputValue('captcha')} onChange={this.fv.handleChange.bind(this.fv, 'captcha')} />
            </div>
          </div>
          <div className="col-sm-6">
            {this.state.captchaUrl ? (<img src={this.state.captchaUrl} alt="验证码" onClick={this.onCaptcha.bind(this)}/>) : null}
          </div>
        </div>
        { room.need_paper == 1? <div className="row">
          <hr className="small" />
          <div className={'form-group col-sm-6 '+this.getBsStyle.call(this, 'prin_student')}>
            <label className="control-label inline-label">负责学生</label>
            <div className="inline-control">
              <input type="text" placeholder="负责学生姓名" className="form-control" value={this.fv.getInputValue('prin_student')} onChange={this.fv.handleChange.bind(this.fv, 'prin_student')} />
            </div>
          </div>
          <div className={'form-group col-sm-6 '+this.getBsStyle.call(this, 'prin_student_phone')}>
            <label className="control-label inline-label">联系方式</label>
            <div className="inline-control">
              <input type="phone" placeholder="负责学生联系方式" className="form-control" value={this.fv.getInputValue('prin_student_phone')} onChange={this.fv.handleChange.bind(this.fv, 'prin_student_phone')} />
            </div>
          </div>
          <div className={'form-group col-sm-6 '+this.getBsStyle.call(this, 'prin_teacher')}>
            <label className="control-label inline-label">负责老师</label>
            <div className="inline-control">
              <input type="text" placeholder="负责老师姓名" className="form-control" value={this.fv.getInputValue('prin_teacher')} onChange={this.fv.handleChange.bind(this.fv, 'prin_teacher')} />
            </div>
          </div>
          <div className={'form-group col-sm-6 '+this.getBsStyle.call(this, 'prin_teacher_phone')}>
            <label className="control-label inline-label">联系方式</label>
            <div className="inline-control">
              <input type="phone" placeholder="负责老师联系方式" className="form-control" value={this.fv.getInputValue('prin_teacher_phone')} onChange={this.fv.handleChange.bind(this.fv, 'prin_teacher_phone')} />
            </div>
          </div>
          <div className={'form-group col-sm-6 '+this.getBsStyle.call(this, 'activity_type')}>
            <label className="control-label inline-label">活动类型</label>
            <div className="inline-control">
              <input type="text" placeholder="活动类型" className="form-control" value={this.fv.getInputValue('activity_type')} onChange={this.fv.handleChange.bind(this.fv, 'activity_type')} />
            </div>
          </div>
          <div className={'form-group col-sm-6 '+this.getBsStyle.call(this, 'need_media')}>
            <label>
              <input type="checkbox" onChange={this.fv.handleChange.bind(this.fv, 'need_media')} checked={this.fv.getInputValue('need_media')} />需要多媒体
            </label>
          </div>
        </div> : null}    
      </form>
    );
  }
}

export default OrderForm;