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
      alert: null
    }
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
    let { user } = this.props;

    this.setState({
      loading: false,
      alert: null,
    });
    this.refs.form.reset();
    this.refs.form.setValues({
      name: user.alias,
      student_no: /^\d{8}$/.test(user.username)? user.username : '' ,
    });
    
    setTimeout(()=>{
      let { room_id, date } = this.props.modal;
      let roomTable = this.props.roomTables[date+'_'+room_id];
      if (roomTable && roomTable.available) {
        $(this.refs.label_order).tab('show');
      } else {
        $(this.refs.label_use).tab('show');
      }
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

  render () {
    let { roomTables, rooms, locks, orders, usage, depts, deptMap} = this.props;
    let { onCaptcha } = this.props;
    let { room_id, date } = this.props.modal;
    let { loading, tab, alert } = this.state;

    let roomTable;
    let room;
    if (roomTables && room_id && date) {
      roomTable = roomTables[date+'_'+room_id];
      room = rooms[room_id]; 
    }else{
      roomTable = {};
      room = {};
    }
    let {ordered, used, locked, available} = roomTable;

    return (
      <div className="modal" ref="modal" data-backdrop="static">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-body">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <ul className="nav nav-tabs" role="tablist">
                <li role="presentation" style={!available ? {display: 'none'} : null}>
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
                <div role="tabpanel" className="tab-pane" id="model-order" style={!available ? {display: 'none'} : null}>
                  <Form ref="form" room_id={room_id} date={date} room={room} hourTable={roomTable.hourTable} depts={depts} deptMap={deptMap}
                    onAlert={this.onFormAlert.bind(this)} onSubmit={this.onSubmit.bind(this)} onCaptcha={onCaptcha} />
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
                <button type="button" className="btn btn-primary" disabled={loading} onClick={this.onSubmitClick.bind(this)}>提交</button>
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