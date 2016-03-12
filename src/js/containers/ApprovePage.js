import React, { Component } from 'react';
import {shouldComponentUpdate} from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import * as ApproveActions from '../actions/ApproveActions';
import * as EntityActions from '../actions/EntityActions';
import Query from '../components/approve/ApproveQuery';
import OrderList from '../components/approve/ApproveOrderList';
import * as ServerApi from '../helpers/ServerApi';
import { isEmptyObject } from '../helpers/Helpers';

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
    console.log(props.params.type);
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

  doGetApproveOrder (type, callback) {
    const { dispatch } = this.props;
    let promise = ServerApi.approve_getOrder(dispatch, type);
    
    promise.then(data => {
      const { orderList, orders } = data;
      !isEmptyObject(orders) && dispatch(EntityActions.updateOrder(orders));
      dispatch(ApproveActions.updateOrderList(orderList));  
      callback && callback(true, data); 
    },error => {
      callback && callback(false, error);
    });
  }

  doSubmitOrder (type, data, callback) {
    const { dispatch } = this.props;

    ServerApi.order_submitOrder(dispatch, data).then(data => {
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
        <Query depts={depts} deptList={deptList} type={type} onQeuryClick={this.doGetApproveOrder.bind(this)} />
        <hr />
      	<OrderList depts={depts} rooms={rooms} type={type} orders={orders} orderList={orderList} />
      </div>
    );
  }
}

export default connect(state => ({
  approve: state.approve,
  entities: state.entities
}))(ApprovePage);