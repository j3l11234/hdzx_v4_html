<template>
  <div class="row scrollspy" id="order-form">
    <div class="col-md-3 col-sm-3">
      <ul ref="sidebar" class="nav nav-sidebar"> 
        <li>
          <a data-target="#form-header-1" href="javascript:void(0)">选择时段</a>
        </li>
        <li>
          <a data-target="#form-header-2" href="javascript:void(0)">填写申请人信息</a>
        </li>
        <li>
          <a data-target="#form-header-3" href="javascript:void(0)">填写申请详情</a>
        </li>
        <li v-if="room.need_paper == 1">
          <a data-target="#form-header-4" href="javascript:void(0)">填写附加信息</a>
        </li>
        <li>
          <a data-target="#form-header-5" href="javascript:void(0)">提交申请</a>
        </li>
      </ul>
    </div>
    <div class="col-md-9 col-sm-9">
      <form class="apply-form" role="form" @submit.prevent="onSubmit" >
        <h2 id="form-header-1" class="page-header">选择时段</h2>
        <div v-if="roomTable.status=='MISSED'" class="alert alert-danger" role="alert">
          <strong>注意：</strong>该时段已不可申请。
        </div>
        <div v-if="roomTable.status=='UPCOMING'" class="alert alert-info" role="alert">
          <strong>注意：</strong>该时段将于{{new Date(roomTable.period.start*1000).Format('yyyy-MM-dd hh:mm:ss')}}开放申请。
        </div>
        <div class="form-group">
          <label class="control-label" for="form-date">日期</label>
          <input type="date" class="form-control" id="form-date" :value="detail.date" @input="updateFormValue('date',$event.target.value)">
        </div>
        <div class="form-group">
          <label class="control-label" for="form-room">房间</label>
          <select class="form-control" id="form-room" :value="detail.room_id" @input="updateFormValue('room_id',$event.target.value)">
            <option v-for="(room, i) in roomList" :value="room.id">{{`${room.name}(${room.number})`}}</option>
          </select>
        </div>
        <HourChoose ref="hourChoose" :hourTable="roomTable.hourTable" :maxHour="this.room.max_hour" :value="form.hours" :error="form_error['hours']"
        @input="updateFormValue('hours', arguments[0])"/>

        <h2 id="form-header-2" class="page-header">填写申请人信息</h2>
        <div :class="'form-group' + getFromStyle('name')">
          <label class="control-label" for="form-name">姓名</label>
          <input type="text" class="form-control" id="form-name" placeholder="请填写申请人姓名"
            :value="form.name" @input="updateFormValue('name',$event.target.value)">
        </div>
        <div :class="'form-group' + getFromStyle('student_no')">
          <label class="control-label" for="form-sid">学号</label>
          <input type="text" class="form-control" id="form-sid" placeholder="请填写申请人学号"
            :value="form.student_no" @input="updateFormValue('student_no',$event.target.value)">
        </div>
        <div :class="'form-group' + getFromStyle('phone')">
          <label class="control-label" for="form-phone">联系方式</label>
          <input type="tel" class="form-control" id="form-phone" placeholder="请填写联系方式"
            :value="form.phone" @input="updateFormValue('phone',$event.target.value)">
        </div>
        <div :class="'form-group' + getFromStyle('dept_id')">
          <label class="control-label" for="form-dept">社团单位</label>
          <DeptSelect :value="form.dept_id" :depts="entity.depts" :deptMap="deptMap" @input="updateFormValue('dept_id', arguments[0])" />
        </div>

        <h2 id="form-header-3" class="page-header">填写申请详情</h2>
        <div :class="'form-group' + getFromStyle('title')">
          <label class="control-label" for="form-title">活动主题</label>
          <input type="text" class="form-control" id="form-title" placeholder="请填写活动主题"
            :value="form.title" @input="updateFormValue('title',$event.target.value)">
        </div>
        <div :class="'form-group' + getFromStyle('content')">
          <label class="control-label" for="form-content">活动内容</label>
          <textarea class="form-control" id="form-content" placeholder="请填写活动内容" rows="3" 
          :value="form.content" @input="updateFormValue('content',$event.target.value)" />
        </div>
        <div :class="'form-group' + getFromStyle('number')">
          <label class="control-label" for="form-secure">活动人数</label>
          <select class="form-control" :value="form.number" @input="updateFormValue('number',$event.target.value)">
            <option value="0">请选择</option>
            <option value="<5">&lt;5</option>
            <option value="5-10">5-10</option>
            <option value="10-50">10-50</option>
            <option value="50-100">50-100</option>
            <option value=">100">&gt;100</option>
          </select>
        </div>
        <div :class="'form-group' + getFromStyle('secure')">
          <label class="control-label" for="form-secure">安保措施</label>
          <textarea class="form-control" id="form-secure" placeholder="请填写安保措施" rows="3"
            :value="form.secure" @input="updateFormValue('secure',$event.target.value)" />
        </div>
        
        <template v-if="room.need_paper == 1">
          <h2 id="form-header-4" class="page-header">填写附加信息</h2>
          <div :class="'form-group' + getFromStyle('prin_student')">
            <label class="control-label" for="form-prin_student">负责学生</label>
            <input type="text" class="form-control" id="form-prin_student" placeholder="请填写负责学生"
              :value="form.prin_student" @input="updateFormValue('prin_student',$event.target.value)">
          </div>
          <div :class="'form-group' + getFromStyle('prin_student_phone')">
            <label class="control-label" for="form-prin_student_phone">负责学生联系方式</label>
            <input type="text" class="form-control" id="form-prin_student_phone" placeholder="请填写负责学生联系方式"
              :value="form.prin_student_phone" @input="updateFormValue('prin_student_phone',$event.target.value)">
          </div>
          <div :class="'form-group' + getFromStyle('prin_teacher')">
            <label class="control-label" for="form-prin_teacher">负责老师</label>
            <input type="text" class="form-control" id="form-prin_teacher" placeholder="请填写请填写负责老师"
              :value="form.prin_teacher" @input="updateFormValue('prin_teacher',$event.target.value)">
          </div>
          <div :class="'form-group' + getFromStyle('prin_teacher_phone')">
            <label class="control-label" for="form-prin_teacher_phone">负责老师联系方式</label>
            <input type="text" class="form-control" id="form-prin_teacher_phone" placeholder="请填写负责老师联系方式"
              :value="form.prin_teacher_phone" @input="updateFormValue('prin_teacher_phone',$event.target.value)">
          </div>
          <div :class="'form-group' + getFromStyle('activity_type')">
            <label class="control-label" for="form-activity_type">活动类型</label>
            <input type="text" class="form-control" id="form-activity_type" placeholder="请填写活动类型"
              :value="form.activity_type" @input="updateFormValue('activity_type',$event.target.value)">
          </div>
          <div class="checkbox">
            <label>
              <input type="checkbox" :checked="form.need_media" @change="updateFormValue('need_media',$event.target.checked)"> 需要多媒体
            </label>
          </div>
        </template>

        <h2 id="form-header-5" class="page-header">提交验证</h2>
        <div :class="'form-group' + getFromStyle('captcha')">
          <label class="control-label" for="form-captcha">验证码</label>
          <img class="img-captcha" :src="captchaUrl" alt="点击获取验证码" @click="onCaptcha" />
          <input type="text" class="form-control" id="form-captcha" placeholder="请填写验证码"
            :value="form.captcha" @input="updateFormValue('captcha',$event.target.value)">
        </div>
        <div class="form-group">
          <button v-if="roomTable.status == 'ACTIVE'" type="submit" :disabled="!isLogined" class="btn btn-primary btn-submit">提交</button>
          <button v-else type="button" class="btn" disabled>不可申请</button>
          <button type="button" class="btn btn-default" @click="onSave">暂存</button>
          <button type="button" class="btn btn-default" @click="onLoad">读取</button>
        </div>
        <div v-if="roomTable.status=='UPCOMING' && countDownText" class="alert alert-info" role="alert">
          {{countDownText}}
        </div>
        <div v-if="!isLogined" class="alert alert-warning" role="alert">
          请先登录
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
import HourChoose from './HourChoose.vue';
import DeptSelect from './DeptSelect.vue';
import { stickAlert } from '../../common/units/Helpers';

const Validators = {
  hours: function(value) {
    if (!value || value.length < 1) {
      return '请选择申请时段';
    }
    if (this.$refs.hourChoose && !this.$refs.hourChoose.validate(value)) {
      return '申请时段不合法';
    }
  },
  name: (value) => {
    if(!value || value.length < 2 || !/[\u4e00-\u9fa5]{2,}|[A-Za-z\s]{5,}/.test(value)) {
      return  '请正确填写姓名';
    }
  }
  ,
  student_no: (value) => {
    if(!/^\d{8}$/.test(value)) {
      return  '请正确填写学号';
    }
  },
  phone: (value) => {
    if(!/^\d{11}$/.test(value)) {
      return  '请正确填写联系方式';
    }
  },
  dept_id: (value) => {
    if(!value || value == 0) {
      return '请选择社团单位';
    }
  },
  title: (value) => {
    if(!value || value.length < 2 || !/[\u4e00-\u9fa5]{2,}|[A-Za-z\s]{5,}/.test(value)) {
      return  '请正确填写标题';
    }
  },
  content: (value) => {
    if(!value || value.length < 4 || !/[\u4e00-\u9fa5]{4,}|[A-Za-z\s]{10,}/.test(value)) {
      return  '请正确填写活动内容';
    }
  },
  number: (value) => {
    if(!value || value == 0) {
      return '请选择活动人数';
    }
  },
  secure: (value) => {
    if(!value || value.length < 4 || !/[\u4e00-\u9fa5]{4,}|[A-Za-z\s]{10,}/.test(value)) {
      return  '请正确填写安保措施';
    }
  },
  captcha: (value) => {
    if(!value) {
      return  '请输入验证码';
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
}

export default {
  name: 'ApplyForm',
  data () {
    return {
      form: {
        hours: [],
        dept_id: null,
        name: null,
        student_no: null,
        phone: null,
        title: null,
        content: null,
        number: null,
        secure: null,
        prin_student: null,
        prin_student_phone: null,
        prin_teacher: null,
        prin_teacher_phone: null,
        activity_type: null,
        need_media: null,
        captcha: null
      },
      form_error: {
        date: null,
        room_id: null,
        hours: null,
        dept_id: null,
        name: null,
        student_no: null,
        phone: null,
        title: null,
        content: null,
        number: null,
        secure: null,
        prin_student: null,
        prin_student_phone: null,
        prin_teacher: null,
        prin_teacher_phone: null,
        activity_type: null,
        need_media: null,
        captcha: null
      },
      countDownText: null
    }
  },
  computed: {
    detail(){
      return this.$store.state.apply.detail;
    },
    roomList() {
      return this.detail.roomList.map((room_id)=>{
        return this.entity.rooms[room_id];
      });
    },
    deptMap() {     
      let { deptMap } = this.detail;
      let _deptMap = {};
      for (let dept_id in deptMap){
        _deptMap[dept_id] = deptMap[dept_id].map((_dept_id)=>{
          return this.entity.depts[_dept_id];
        });
      }
      return _deptMap;
    },
    captchaUrl() {
      return this.detail.captchaUrl;
    },
    entity() {
      return this.$store.state.entity;
    },
    roomTable() {
      let { date, room_id } = this.detail;
      let { roomTables } = this.$store.state.roomTable;

      if (date && room_id && roomTables[date+'_'+room_id]) {
        return roomTables[date+'_'+room_id];
      }
      return {
        period: {
          start:0,
          end:0,
        }
      };
    },
    room() {
      let { room_id } = this.detail;
      let { rooms } = this.$store.state.entity;
      if (room_id && rooms[room_id]) {
        return rooms[room_id];
      }
      return {};
    },
    isLogined() {
      return this.$store.state.user ? true : false;
    }
  },
  components: {
    HourChoose,
    DeptSelect
  },
  methods: {
    onCaptcha() {
      this.$store.dispatch('apply_updateCaptcha');
    },
    updateFormValue(name, value) {
      if (name == 'date') {
        value != '' && this.$store.dispatch('apply_chooseDateRoom', { date: value, room_id: this.detail.room_id});
      } else if (name == 'room_id') {
        this.form.date != '' && this.$store.dispatch('apply_chooseDateRoom', { date: this.detail.date, room_id: value});
      } else {
        let error;
        if (typeof Validators[name] === 'function') {
          this.$data.form_error[name] = Validators[name].call(this,value);
        }
        this.$data.form[name] = value;
      }
    },
    getFromStyle(name) {
      if(!this.form_error[name]){
        return '';
      }else{
        return ' has-error';
      }
    },
    onSave() {
      if(!window.localStorage) {
        stickAlert('warning', '浏览不支持localStorage');
        return;
      }

      let fields = ['hours','name','student_no','phone','dept_id', 'title','content','number','secure','prin_student', 'prin_student_phone', 'prin_teacher', 'prin_teacher_phone', 'activity_type', 'need_media'];
      let formData = {};
      fields.map(name => {
        let _value = this.$data.form[name];
        formData[name] = _value;
      });  
      localStorage.setItem("_apply_form_data", JSON.stringify(formData));
      stickAlert('warning', '表单数据暂存成功');
    },
    onLoad() {
      if(!window.localStorage) {
        stickAlert('warning', '浏览不支持localStorage');
        return;
      }

      let formData = localStorage.getItem('_apply_form_data');
      if(!formData) {
        stickAlert('warning', '无暂存表单数据');
        return;
      }
      formData = JSON.parse(formData);
      let fields = ['hours','name','student_no','phone','dept_id','title','content','number','secure','prin_student', 'prin_student_phone', 'prin_teacher', 'prin_teacher_phone', 'activity_type', 'need_media'];
      fields.map(name => {
        let _value = formData[name];
        if(_value === null) {
          return;
        }
        if (typeof Validators[name] === 'function') {
          this.$data.form_error[name] = Validators[name].call(this,_value);
        }
        this.$data.form[name] = _value;
      });
      stickAlert('warning', '表单数据恢复成功');
    },
    onReset() {

    },
    onSubmit() {
      let fields = ['hours','name','student_no','phone','dept_id','title','content','number','secure','captcha'];
      this.room.need_paper == 1 && (fields = fields.concat(['prin_student', 'prin_student_phone', 'prin_teacher', 'prin_teacher_phone', 'activity_type', 'need_media']));

      let error;
      let formData = {};
      fields.map(name => {
        let _value = this.$data.form[name];
        formData[name] = _value;
        if (typeof Validators[name] === 'function') {
          let _error = Validators[name].call(this, _value);
          this.$data.form_error[name] = _error;
            _error && !error && (error = _error);
        }
      });
      if (error){
        stickAlert('danger',error);
        return;
      }
      formData.hours = JSON.stringify(formData.hours);
      formData.date = this.detail.date;
      formData.room_id = this.detail.room_id;
      this.$store.dispatch('apply_submit',{data: formData}).then(data => {
        this.$store.dispatch('apply_updateCaptcha');
        this.form.captcha = '';
      });
      
    },
    countDown() {
      let timeOffset = this.$store.state.timeOffset;
      if (this.roomTable.status != 'UPCOMING') {
        return;
      }

      let now = Math.floor((new Date().getTime() + timeOffset) / 1000);
      let diff = this.roomTable.period.start - now;
      let countDownText;
      if (diff >=0 && diff < 86400) {
        let hours = Math.floor(diff/3600);
        let minutes = Math.floor(diff/60) % 60;
        let seconds = Math.floor(diff) % 60;
        hours = hours >= 10 ? hours : '0'+hours;
        minutes = minutes >= 10 ? minutes : '0'+minutes;
        seconds = seconds >= 10 ? seconds : '0'+seconds;

        countDownText = `${hours}:${minutes}:${seconds}后开放申请`;
      }
      this.countDownText = countDownText;
    }
  },
  mounted() {
    $(document.body).scrollspy({
      target: '.scrollspy',
      offset: 80
    });
    $(this.$refs.sidebar).affix({
      offset: {
        top: 120,
        bottom: function () {
          return (this.bottom = $('.footer').outerHeight(true))
        }
      }
    });
    this.$store.dispatch('apply_updateCaptcha');
    setInterval(this.countDown.bind(this),1000);
  },
}

</script>
