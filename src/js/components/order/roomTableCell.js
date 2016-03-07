import React, { Component } from 'react';

import { statusClass } from '../../constants/RoomTableStatus';

class RoomTableCell extends Component {
  constructor (props) {
    super(props);
  }

  shouldComponentUpdate (nextProps, nextState) {
    return this.props.chksum !== nextProps.chksum;
  }

  onClick(){
    //this.props.onCellClick(this.props.room, this.props.date);
  }

  getCellClass (hourTable, hour) {
      let className = statusClass[hourTable[hour]]
      if(className == undefined){
        className = 'z-rt-free';
      }
      return className;
    }

  render() {
    let { hourTable } = this.props;
    return !hourTable ? null : (
      <div className="rt-table-item" onClick={this.onClick.bind(this)}>
        <div className={this.getCellClass(hourTable, 8)}>8</div>
        <div className={this.getCellClass(hourTable, 9)}>9</div>
        <div className={this.getCellClass(hourTable, 10)}>10</div>
        <div className={this.getCellClass(hourTable, 11)}>11</div>
        <br />
        <div className={this.getCellClass(hourTable, 12)}>12</div>
        <div className={this.getCellClass(hourTable, 13)}>13</div>
        <div className={this.getCellClass(hourTable, 14)}>14</div>
        <br />
        <div className={this.getCellClass(hourTable, 15)}>15</div>
        <div className={this.getCellClass(hourTable, 16)}>16</div>
        <div className={this.getCellClass(hourTable, 17)}>17</div>
        <div className={this.getCellClass(hourTable, 18)}>18</div>
        <br />
        <div className={this.getCellClass(hourTable, 19)}>19</div>
        <div className={this.getCellClass(hourTable, 20)}>20</div>
        <div className={this.getCellClass(hourTable, 21)}>21</div>
        <br />
      </div>
    );
  }
}

export default RoomTableCell;