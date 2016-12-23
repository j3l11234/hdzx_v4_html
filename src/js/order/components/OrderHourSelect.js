import React, { Component } from 'react';
import { shouldComponentUpdate } from 'react/lib/ReactComponentWithPureRenderMixin';

import { STATUS, statusClass } from '../../common/constants/RoomTable';

class OrderHourSelect extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = shouldComponentUpdate.bind(this);
   
    this.hasStart = false;
    this.state = {
      start_hour: null,
      end_hour: null
    };
  }

  reset () {
    this.hasStart = false;
    this.setState({
      start_hour: null,
      end_hour: null
    });
  }
  
  onCellClick(hour) {
    let { hourTable, maxHour } = this.props;
    let { start_hour, end_hour } = this.state;
    if(!this.hasStart){ //未选择开始时间
      start_hour = hour;
      end_hour = hour+1;
      this.hasStart = true;
    } else { //已经选择开始时间
      //开始结束判断
      if(start_hour <= hour){ 
        end_hour = hour+1;
      }else{
        start_hour = hour;
      }
      this.hasStart = false;
    }

    //区间长度判断
    let hours = [];
    let isValid = true;
    if(!maxHour || end_hour-start_hour <= maxHour) {
      //区间判断
      for (let h = start_hour; h < end_hour; h++) {
        if (hourTable[h] != STATUS.FREE &&
            hourTable[h] != STATUS.ORDERED) {
          isValid = false;
          break; 
        }
      }
    } else {
      isValid = false;
    }

    if(!isValid){
      hours = [];
      start_hour = null;
      end_hour = null;
      this.hasStart = false;
    }
    this.setState({
      start_hour: start_hour,
      end_hour: end_hour
    });

    if(!this.hasStart){
      this.props.onChooseHours(start_hour, end_hour);
    }
  }

  getCellClass (hour) {
    let { hourTable } = this.props;
    let { start_hour, end_hour } = this.state; 
    let className = statusClass[hourTable[hour]]
    if (hour >= start_hour && hour < end_hour) {
      className += ' z-rt-choosen';
    }
    return className;
  }

  render() {
    let { hourTable } = this.props;
    return (
      <div className="hourselect">
        <div className={this.getCellClass.call(this, 8)} onClick={this.onCellClick.bind(this, 8)}>8</div>
        <div className={this.getCellClass.call(this, 9)} onClick={this.onCellClick.bind(this, 9)}>9</div>
        <div className={this.getCellClass.call(this, 10)} onClick={this.onCellClick.bind(this, 10)}>10</div>
        <div className={this.getCellClass.call(this, 11)} onClick={this.onCellClick.bind(this, 11)}>11</div>
        <br />
        <div className={this.getCellClass.call(this, 12)} onClick={this.onCellClick.bind(this, 12)}>12</div>
        <div className={this.getCellClass.call(this, 13)} onClick={this.onCellClick.bind(this, 13)}>13</div>
        <div className={this.getCellClass.call(this, 14)} onClick={this.onCellClick.bind(this, 14)}>14</div>
        <br />
        <div className={this.getCellClass.call(this, 15)} onClick={this.onCellClick.bind(this, 15)}>15</div>
        <div className={this.getCellClass.call(this, 16)} onClick={this.onCellClick.bind(this, 16)}>16</div>
        <div className={this.getCellClass.call(this, 17)} onClick={this.onCellClick.bind(this, 17)}>17</div>
        <div className={this.getCellClass.call(this, 18)} onClick={this.onCellClick.bind(this, 18)}>18</div>
        <br />
        <div className={this.getCellClass.call(this, 19)} onClick={this.onCellClick.bind(this, 19)}>19</div>
        <div className={this.getCellClass.call(this, 20)} onClick={this.onCellClick.bind(this, 20)}>20</div>
        <div className={this.getCellClass.call(this, 21)} onClick={this.onCellClick.bind(this, 21)}>21</div>
        <br />
      </div>
    );
  }
}

export default OrderHourSelect;