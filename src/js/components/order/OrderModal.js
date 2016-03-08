import React, { Component } from 'react';
import {shouldComponentUpdate} from 'react-addons-pure-render-mixin';
import { Button, ButtonInput, Glyphicon, Modal, Tab, Tabs } from 'react-bootstrap';

import Form from './OrderForm';
import HourSelect from './OrderHourSelect';
import Note from './OrderNote';
import OrderList from './OrderOrderList';
import LockList from './OrderLockList';

class OrderModal extends Component {
  constructor (props) {
    super(props);

    this.state = {
      show: false,
      loading: false,
      startHour: null,
      endHour: null,
      hours: null
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(!this.state.show && !nextState.show){
      return false;
    }
    return shouldComponentUpdate.call(this, nextProps, nextState);
  }

  showModal() {
    this.setState({ show: true });
  }

  hideModal() {
    this.setState({ show: false });
  } 

  onSubmit() {
    let form = this.refs.form;
    let formData = form.getFormData();
    if(!formData){
      return;
    }
    if (!this.state.hours) {
      form.setState({
        alert: { style: 'danger', text: '请选择预约时段'}
      });
      return;
    }
    
    formData = Object.assign(formData, {
      room: this.state.room.id,
      date: this.state.date,
      hours: JSON.stringify(this.state.hours)
    });
    console.log(formData);

    form.setState({alert: null});
    this.setState({loading: true});
    this.props.onSubmit(formData,(success,data) => {
      console.log(success,data);
      if(data.status == 200){
        form.setState({
          alert: { style: 'success', text: data.message}
        });
      }else{
        this.setState({loading: false});
        form.setState({
          alert: { style: 'danger', text: data.message}
        });
      }
    });
  }
  // onSubmitClick(e) {
  //   this.refs.form.submitOrder();
  // }
  
  // onModelHide(){
  //   let form = this.refs.form.getFormData();
  //   this.props.onFormChange(form);
  //   this.props.onHide();
  // }

  onChooseHours (startHour, endHour, hours) {
    this.setState({startHour, endHour, hours});
  }

  getListFormTable (table, hours) {
    var ids = {};
    var idList = [];
    for(var hour in table) {
      if(!hours || hours.indexOf(parseInt(hour)) != -1) {
        for(var key in table[hour]) {
          ids[table[hour][key]] = true;
        }
      }
    }
    for(var id in ids) {
      idList.push(id);
    }
    return idList;
  }

  render () {
    console.log(this.state);

    let { locks, depts, orders, deptList } = this.props;
    let { roomTable, room, date, startHour, endHour, loading } = this.state;
    roomTable = roomTable ? roomTable : {};
    room = room ? room : {};
    let { hourTable } = roomTable;
    let { max_hour } = room;
    let roomName = room.number+' - '+room.name;

    let orderList = this.getListFormTable(roomTable.used);
    orderList.concat(this.getListFormTable(roomTable.ordered));
    let lockList = this.getListFormTable(roomTable.locked)

    return (
      <Modal show={this.state.show} onHide={this.hideModal.bind(this)} backdrop={'static'}>
        <Modal.Body>
          <button type="button" className="close" aria-label="Close" onClick={this.hideModal.bind(this)}>
            <span aria-hidden="true">&times;</span>
          </button>
          <Tabs defaultActiveKey={1}>
            <Tab eventKey={1} title="房间预约">
              <div className="row">
                <div className="col-sm-6">
                  <HourSelect hourTable={hourTable} maxHour={max_hour} onChooseHours={this.onChooseHours.bind(this)}/>
                </div>
                <div className="col-sm-6">
                  <Note ref="note" date={date} roomName={roomName} startHour={startHour} endHour={endHour} maxHour={max_hour}/>
                </div>
                <div className="clearfix"></div>
                <Form ref="form" depts={depts} deptList={deptList} form={null} onSubmit={this.onSubmit.bind(this)} />
              </div>
            </Tab>
            <Tab eventKey={2} title="使用情况">
              <OrderList orders={orders} depts={depts} orderList={orderList} />
              <LockList locks={locks} lockList={lockList} />
            </Tab>
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.hideModal.bind(this)}>关闭</Button>
          <Button bsStyle="primary" disabled={loading} onClick={this.onSubmit.bind(this)}>提交</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default OrderModal;