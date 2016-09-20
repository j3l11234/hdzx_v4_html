import React, { Component } from 'react';
import { shouldComponentUpdate } from 'react/lib/ReactComponentWithPureRenderMixin';

import Form from './OrderForm';
import OrderList from './OrderOrderList';
import LockList from './OrderLockList';
import Usage from './OrderUsage';

class OrderModal extends Component {
  constructor (props) {
    super(props);
    this.shouldComponentUpdate = shouldComponentUpdate.bind(this);

    this.state = {
      loading: false
    }
  }

  showModal() {
    let { user } = this.props;
    setTimeout(() => {
      let { room_id, date, onQueryUse, doGetUsage } = this.props;
      onQueryUse(room_id, date);
      doGetUsage(date);
    }, 500);

    this.setState({ loading: false });
    this.refs.form.reset();
    this.refs.form.setValues({
      name: user.alias,
      student_no: /^\d{8}$/.test(user.username)? user.username : '' ,
    });
    
    setTimeout(()=>{
      let {dateAvail, privAvail } = this.props;
      $(this.refs.modal).modal('show');
      if (dateAvail && privAvail) {
        $(this.refs.label_order).show();
        $(this.refs.label_order).tab('show');
      } else {
        $(this.refs.label_order).hide();
        $(this.refs.label_use).tab('show');
      }
    }, 0);
  }

  onSubmitClick() {
    this.refs.form.onSubmit.call(this.refs.form,this);
  }

  render () {
    let { roomTables, rooms, locks, orders, room_id, date, dateAvail, privAvail, usage, depts, deptMap} = this.props;
    let { loading } = this.state;

    let roomTable;
    let room;
    if (roomTables && room_id && date) {
      roomTable = roomTables[date+'_'+room_id];
      room = rooms[room_id]; 
    }else{
      roomTable = {};
      room = {};
    }

    let {ordered, used, locked} = roomTable;

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
                <div role="tabpanel" className="tab-pane" id="model-order">
                  <Form ref="form" room_id={room_id} date={date} room={room} hourTable={roomTable.hourTable} depts={depts} deptMap={deptMap}
                   onSubmit={this.props.onSubmit} onCaptcha={this.props.onCaptcha} />
                </div>
                <div role="tabpanel" className="tab-pane" id="model-use">
                  <OrderList orders={orders} ordered={ordered} used={used} />
                  <LockList locks={locks} locked={locked} />
                </div>
                <div role="tabpanel" className="tab-pane" id="model-usage">
                  <Usage monthUsage={usage.month[room_id]} weekUsage={usage.week[room_id]} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal">关闭</button>
              <button type="button" className="btn btn-primary" disabled={loading} onClick={this.onSubmitClick.bind(this)}>提交</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default OrderModal;