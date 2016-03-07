import React, { Component } from 'react';
import {shouldComponentUpdate} from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';

import Query from '../components/order/RoomTableQuery';
import RoomTable from '../components/order/RoomTable';

class OrderPage extends Component {
	constructor(props) {
    super(props);
    this.shouldComponentUpdate = shouldComponentUpdate.bind(this);
  }
  render() {
    let { roomTable } = this.props;
    let { rooms } = this.props.entities;
    
    return (
      <div>
      	<Query />
        <RoomTable rooms={rooms} roomTable={roomTable} />
      </div>
    );
  }
}

export default connect(state => ({
	roomTable: state.roomTable,
  entities: state.entities
}))(OrderPage);