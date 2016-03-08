import React, { Component } from 'react';
import {shouldComponentUpdate} from 'react-addons-pure-render-mixin';

import { status, statusClass } from '../../constants/RoomTableStatus';

const HOUR_OFFSET = 8;

class OrderHourSelect extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = shouldComponentUpdate.bind(this);

    
    this.hasStart = false;
    this.state = {
      startHour: null,
      endHour: null
    };
  }

  onCellClick(hour) {
    let { hourTable, maxHour } = this.props;
    let {startHour, endHour} = this.state;
    if(!this.hasStart){ //未选择开始时间
      startHour = hour;
      endHour = hour;
      this.hasStart = true;
    }else{ //已经选择开始时间
      //开始结束判断
      if(startHour <= hour){ 
        endHour = hour;
      }else{
        startHour = hour;
      }
      this.hasStart = false;
    }

    //区间长度判断
    let hours = [];
    let isValidated = true;
    if(!maxHour || endHour-startHour+1 <= maxHour) {
      //区间判断
      for (let h = startHour; h <= endHour; h++) {
        if (hourTable[h] == status.FREE ||
            hourTable[h] == status.ORDERED) {
          hours.push(h);
        } else {
          isValidated = false;
          break; 
        }
      }
    } else {
      isValidated = false;
    }
    if(!isValidated){
      hours = [];
      startHour = null;
      endHour = null;
      this.hasStart = false;
    }
    this.setState({
      startHour: startHour,
      endHour: endHour
    });

    if(!this.hasStart){
      this.props.onChooseHours(startHour, endHour, hours);
    }
  }

  
  getCellClass (hour) {
    let { hourTable } = this.props;
    let { startHour, endHour } = this.state; 
    let className = statusClass[hourTable[hour]]
    if (hour >= startHour && hour <= endHour) {
      className += ' z-rt-choosen';
    }
    return className;
  }

  render() {
    let { hourTable } = this.props;
    return (
      <div className="hourselect">
        <div className={this.getCellClass.call(this, 8)} onClick={this.onCellClick.bind(this,8)}>8</div>
        <div className={this.getCellClass.call(this, 9)} onClick={this.onCellClick.bind(this,9)}>9</div>
        <div className={this.getCellClass.call(this, 10)} onClick={this.onCellClick.bind(this,10)}>10</div>
        <div className={this.getCellClass.call(this, 11)} onClick={this.onCellClick.bind(this,11)}>11</div>
        <br />
        <div className={this.getCellClass.call(this, 12)} onClick={this.onCellClick.bind(this,12)}>12</div>
        <div className={this.getCellClass.call(this, 13)} onClick={this.onCellClick.bind(this,13)}>13</div>
        <div className={this.getCellClass.call(this, 14)} onClick={this.onCellClick.bind(this,14)}>14</div>
        <br />
        <div className={this.getCellClass.call(this, 15)} onClick={this.onCellClick.bind(this,15)}>15</div>
        <div className={this.getCellClass.call(this, 16)} onClick={this.onCellClick.bind(this,16)}>16</div>
        <div className={this.getCellClass.call(this, 17)} onClick={this.onCellClick.bind(this,17)}>17</div>
        <div className={this.getCellClass.call(this, 18)} onClick={this.onCellClick.bind(this,18)}>18</div>
        <br />
        <div className={this.getCellClass.call(this, 19)} onClick={this.onCellClick.bind(this,19)}>19</div>
        <div className={this.getCellClass.call(this, 20)} onClick={this.onCellClick.bind(this,20)}>20</div>
        <div className={this.getCellClass.call(this, 21)} onClick={this.onCellClick.bind(this,21)}>21</div>
        <br />
      </div>
    );
  }
}

export default OrderHourSelect;