import React, { Component } from 'react';
import { shouldComponentUpdate } from 'react/lib/ReactComponentWithPureRenderMixin';

import Form from './OrderForm';
import OrderList from './OrderOrderList';
import LockList from './OrderLockList';

class OrderModal extends Component {
  constructor (props) {
    super(props);

    this.state = {
      show: false,
      loading: false
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(!nextState.show){
      return false;
    }
    return shouldComponentUpdate.call(this, nextProps, nextState);
  }

  componentDidMount() {
    $(this.refs.modal).on('show.bs.modal', e => {
      this.setState({ show: true });
    });
    $(this.refs.modal).on('hide.bs.modal', e => {
      this.setState({ show: false });
    });
  }

  componentDidUpdate() {
    $(this.refs.modal).off('show.bs.modal');
    $(this.refs.modal).off('hide.bs.modal');
    $(this.refs.modal).on('show.bs.modal', e => {
      this.setState({ show: true });
    });
    $(this.refs.modal).on('hide.bs.modal', e => {
      this.setState({ show: false });
    });
  }

  showModal() {
    setTimeout(()=>{
      let { room_id, date } = this.props;
      this.props.onQueryUse(room_id, date);
    }, 500);
    this.setState({ loading: false });
    this.refs.form.reset();
    $(this.refs.modal).modal('show');
  }

  onSubmitClick() {
    this.refs.form.onSubmit.call(this.refs.form,this);
  }

  render () {
    let { roomTables, rooms, locks, depts, orders, deptList, room_id, date } = this.props;
    let { loading } = this.state;

    let roomTable;
    let room;
    if (roomTables && room_id && date) {
      roomTable = roomTables ? roomTables[room_id][date] : {};
      room = rooms[room_id]; 
    }else{
      roomTable = {};
      room = {};
    }

    let {ordered, used, locked} = roomTable;

    return (
      <div className="modal fade" ref="modal" data-backdrop="static">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <ul className="nav nav-tabs" role="tablist">
                <li role="presentation" className="active">
                  <a href="#model-order" aria-controls="model-order" role="tab" data-toggle="tab">房间预约</a>
                </li>
                <li role="presentation">
                  <a href="#model-use" aria-controls="model-use" role="tab" data-toggle="tab">使用情况</a>
                </li>
              </ul>
            </div>
            <div className="modal-body">
              <div className="tab-content">
                <div role="tabpanel" className="tab-pane active" id="model-order">
                  <Form ref="form" depts={depts} deptList={deptList} room_id={room_id} date={date} room={room} hourTable={roomTable.hourTable} onSubmit={this.props.onSubmit} onCaptcha={this.props.onCaptcha} />
                </div>
                <div role="tabpanel" className="tab-pane" id="model-use">
                  <OrderList orders={orders} ordered={ordered} used={used} />
                  <LockList locks={locks} locked={locked} />
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