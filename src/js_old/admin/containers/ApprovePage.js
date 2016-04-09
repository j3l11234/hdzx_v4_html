import React, { Component } from 'react';
import {shouldComponentUpdate} from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import * as ApproveActions from '../actions/ApproveActions';
import * as EntityActions from '../../common/actions/EntityActions';
import Query from '../components/approve/ApproveQuery';
import OrderList from '../components/approve/ApproveOrderList';
import Modal from '../components/approve/ApproveModal';
import * as ServerApi from '../../common/helpers/ServerApi';
import { isEmptyObject, getListFormTable } from '../../common/helpers/Helpers';

class ApprovePage extends Component {
	constructor(props) {
    super(props);
    this.shouldComponentUpdate = shouldComponentUpdate.bind(this);
  }
  
  componentWillMount () {
    this.checkType(this.props);
  }

  componentWillReceiveProps (nextProps) {
    if(nextProps.params.type !== this.props.params.type){
      this.checkType(nextProps);
    }
  }

  checkType(props){
    switch (props.params.type){
      case 'auto':
      break;
      case 'manager':
      break;
      case 'school':
      break;
      default:
        this.props.dispatch(push('/'))
        break;
    }
  }

  doGetOrder (type, callback) {
    const { dispatch } = this.props;
    let promise = ServerApi.approve_getOrder(dispatch, type);
    
    promise.then(data => {
      const { orderList, orders, roomTables } = data;
      //分析冲突预约
      for (var order_id in orders) {
        let order = orders[order_id];
        let roomTable = roomTables[order.room_id][order.date];
        
        let parallelOrders = getListFormTable(roomTable.ordered,order.hours).concat(getListFormTable(roomTable.used,order.hours));
        let conflictOrders = [];
        for(var i in parallelOrders) {
          let order_id_ = parallelOrders[i];
          if (!orders[order_id_]) {
            continue;
          }
          conflictOrders.push(order_id_);
        }
        order.conflict = conflictOrders;
      }
      
      !isEmptyObject(orders) && dispatch(EntityActions.updateOrder(orders));
      dispatch(ApproveActions.updateOrderList(orderList));  
      callback && callback(true, data); 
    },error => {
      callback && callback(false, error);
    });
  }

  showApproveModel (order_id, type, operate){
    let order = this.props.entities.orders[order_id];
    let dept = this.props.entities.depts[order.dept_id];
    let room = this.props.entities.rooms[order.room_id];

    this.refs.modal.setState({room, order, type, operate, dept, loading:false});
    this.refs.modal.showModal();
  }

  doOperateOrder (type, operate, order_id, comment, callback) {
    console.log(type, operate, order_id, comment);
    const { dispatch } = this.props;

    let promise;
    switch(operate) {
      case 'approve':
        promise = ServerApi.approve_approveOrder(dispatch, type, order_id, comment);
        break;
      case 'reject':
        promise = ServerApi.approve_rejectOrder(dispatch, type, order_id, comment);
        break;
      case 'revoke':
        promise = ServerApi.approve_revokeOrder(dispatch, type, order_id, comment);
        break;
      default:
        return;
    }
    promise.then(data => {
      callback && callback(true, data);
    },error => {
      callback && callback(false, error);
    });
  }

  render() {
    let { rooms, locks, depts, orders } = this.props.entities;
    let { deptList, orderList } = this.props.approve;
    let type = this.props.routeParams.type;

    return (
      <div>
        <Query depts={depts} deptList={deptList} type={type} onQeuryClick={this.doGetOrder.bind(this)} />
        <hr />
      	<OrderList depts={depts} rooms={rooms} type={type} orders={orders} orderList={orderList} 
        onOperateClick={this.showApproveModel.bind(this)}/>
        <Modal ref="modal" onSubmit={this.doOperateOrder.bind(this)} />
      </div>
    );
  }
}

export default connect(state => ({
  approve: state.approve,
  entities: state.entities
}))(ApprovePage);