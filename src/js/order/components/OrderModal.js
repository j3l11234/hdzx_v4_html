import React, { Component } from 'react';
import { shouldComponentUpdate } from 'react/lib/ReactComponentWithPureRenderMixin';

import Form from './OrderForm';
import FormAlert from '../../common/components/FormAlert';
import OrderList from './OrderOrderList';
import LockList from './OrderLockList';
import Usage from './OrderUsage';

class OrderModal extends Component {
  constructor (props) {
    super(props);
    this.shouldComponentUpdate = shouldComponentUpdate.bind(this);

    this.state = {
      loading: false,
      tab: '',
      alert: null,
      countdownText: '尚未开放'
    }

    this.actions = {
      onSubmitClick: this.onSubmitClick.bind(this),
      onFormAlert: this.onFormAlert.bind(this),
      onSubmit: this.onSubmit.bind(this),
      updateCountDown: this.updateCountDown.bind(this),
    };

    this.countdownTimer;
  }

  componentDidMount() {
    let {label_order, label_use, label_usage} = this.refs;
    $([label_order, label_use, label_usage]).on('shown.bs.tab', e => {
      if (e.target === label_order) {
        this.setState({tab: 'order'});
      } else if (e.target === label_use) {
        this.setState({tab: 'use'});
      } else if (e.target === label_usage) {
        this.setState({tab: 'usage'});
      }
    });
  }

  showModal() {
    this.setState({
      loading: false,
      alert: null,
    });
    
    
    setTimeout(()=>{
      let { roomTable, room, user } = this.props;

      if (roomTable.status == 'UPCOMING'){
        this.countdownTimer = setInterval(this.actions.updateCountDown, 1000);
      }
      
      this.refs.form.reset();
      this.refs.form.setValues({
        name: user.alias,
        student_no: /^\d{8}$/.test(user.username)? user.username : '' ,
        secure: room.secure == 0 ? '系统自动填写' : ''
      });

      
      $(this.refs.label_order).tab('show');
      $(this.refs.modal).modal('show');
    }, 0);

  }

  onSubmitClick() {
    let form = this.refs.form;
    form.onSubmit.call(form);
  }

  onSubmit(data) {
    let { onSubmit } = this.props;
    this.setState({loading: true});
    return onSubmit(data).then(data => {
      this.setState({
        alert: {tabs: ['order'], style: 'success', text: data.message}
      });
      return data;
    }, data => {
      this.setState({
        loading: false,
        alert: {tabs: ['order'], style: 'danger', text: data.message}
      });
      throw data;
    });
  }

  onFormAlert(alert){
    alert.tabs = ['order'];
    this.setState({alert});
  }

  updateCountDown() {
    let { roomTable, timeOffset } = this.props;
    if (!roomTable || roomTable.status != 'UPCOMING') {
      clearTimeout(this.countdownTimer);
      this.countdownTimer = null;
      return;
    }

    let now = Math.floor((new Date().getTime() + timeOffset) / 1000);
    let diff = roomTable.period.start - now;
    let countdownText = '';
    if (diff < 86400) {
      let hours = Math.floor(diff/3600);
      let minutes = Math.floor(diff/60) % 60;
      let seconds = Math.floor(diff) % 60;
      hours = hours >= 10 ? hours : '0'+hours;
      minutes = minutes >= 10 ? minutes : '0'+minutes;
      seconds = seconds >= 10 ? seconds : '0'+seconds;

      countdownText = `${hours}:${minutes}:${seconds}`;
    } else {
      countdownText = "尚未开放";
    }
    this.setState({countdownText});
  }

  render () {
    let { roomTable, room, locks, orders, usage, depts, deptMap} = this.props;
    let { onSubmitClick, onSubmit, onFormAlert } = this.actions;
    let { onCaptcha } = this.props;
    let { room_id, date } = this.props.modal;
    let { loading, tab, alert,countdownText } = this.state;

    roomTable = roomTable ? roomTable : {};
    room = room ? room : {};

    let {ordered, used, locked, status} = roomTable;

    let submitBtn;
    if (status == 'ACTIVE') {
      submitBtn = (<button type="button" className="btn btn-primary" disabled={loading} onClick={onSubmitClick}>提交</button>);
    } else if (status == 'UPCOMING') {
        submitBtn = (<button type="button" className="btn btn-primary" disabled={true}>{countdownText}</button>);
    } else if(status == 'MISSED') {
        submitBtn = (<button type="button" className="btn btn-primary" disabled={true}>不可申请</button>);
    }


    return (
      <div className="modal" ref="modal" data-backdrop="static">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-body">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <ul className="nav nav-tabs" role="tablist">
                <li role="presentation">
                  <a ref="label_order" href="#model-order" aria-controls="model-order" role="tab" data-toggle="tab">房间预约</a>
                </li>
                <li role="presentation">
                  <a ref="label_use" href="#model-use" aria-controls="model-use" role="tab" data-toggle="tab">使用情况</a>
                </li>
                <li role="presentation">
                  <a ref="label_usage" href="#model-usage" aria-controls="model-usage" role="tab" data-toggle="tab">可用额度</a>
                </li>
              </ul>
              <div className="tab-content">
                <div role="tabpanel" className="tab-pane" id="model-order" >
                  <Form ref="form" date={date} room={room} hourTable={roomTable.hourTable} depts={depts} deptMap={deptMap}
                    onAlert={onFormAlert} onSubmit={onSubmit} onCaptcha={onCaptcha} />
                </div>
                <div role="tabpanel" className="tab-pane" id="model-use">
                  <OrderList orders={orders} ordered={ordered} used={used} />
                  <LockList locks={locks} locked={locked} />
                </div>
                <div role="tabpanel" className="tab-pane" id="model-usage">
                  <Usage monthUsage={usage.month[room_id]} weekUsage={usage.week[room_id]} />
                </div>
              </div>
              {alert && alert.tabs.indexOf(tab) !== -1 ? <FormAlert style={alert.style} text={alert.text} /> : null}
            </div>
            {tab === 'order' ? 
              <div className="modal-footer">
                <button type="button" className="btn btn-default" data-dismiss="modal">取消</button>
                {submitBtn}
              </div> : 
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" data-dismiss="modal">确定</button>
              </div>  
            }
          </div>
        </div>
      </div>
    );
  }
}
export default OrderModal;