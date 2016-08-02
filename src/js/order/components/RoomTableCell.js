import React, { Component } from 'react';

import { statusClass } from '../../common/constants/RoomTableStatus';

class RoomTableCell extends Component {
  constructor (props) {
    super(props);
  }

  shouldComponentUpdate (nextProps, nextState) {
    return (this.props.chksum !== nextProps.chksum ||
      this.props.dateAvail !== nextProps.dateAvail ||
      this.props.privAvail !== nextProps.privAvail);
  }

  onClick(){
    let {onCellClick, room, date, dateAvail, privAvail} = this.props;
    onCellClick(room, date, dateAvail, privAvail);
  }

  getCellClass (hourTable, hour) {
    let className = statusClass[hourTable[hour]]
    if(className == undefined){
      className = 'z-rt-free';
    }
    return className;
  }

  render() {
    console.log('render RoomTableCell');
    let { hourTable, dateAvail, privAvail } = this.props;
    return !hourTable ? null : (

      <div className={'rt-table-item '+ (dateAvail && privAvail ? '' : 'disabled')} onClick={this.onClick.bind(this)} 
        dangerouslySetInnerHTML={{__html: 
          '<div class="' + this.getCellClass(hourTable, 8) + '">8</div>' +
          '<div class="' + this.getCellClass(hourTable, 9) + '">9</div>' +
          '<div class="' + this.getCellClass(hourTable, 10) + '">10</div>' +
          '<div class="' + this.getCellClass(hourTable, 11) + '">11</div>' +
          '<br>' +
          '<div class="' + this.getCellClass(hourTable, 12) + '">12</div>' +
          '<div class="' + this.getCellClass(hourTable, 13) + '">13</div>' +
          '<div class="' + this.getCellClass(hourTable, 14) + '">14</div>' +
          '<br>' +
          '<div class="' + this.getCellClass(hourTable, 15) + '">15</div>' +
          '<div class="' + this.getCellClass(hourTable, 16) + '">16</div>' +
          '<div class="' + this.getCellClass(hourTable, 17) + '">17</div>' +
          '<div class="' + this.getCellClass(hourTable, 18) + '">18</div>' +
          '<br>' +
          '<div class="' + this.getCellClass(hourTable, 19) + '">19</div>' +
          '<div class="' + this.getCellClass(hourTable, 20) + '">20</div>' +
          '<div class="' + this.getCellClass(hourTable, 21) + '">21</div>' +
          '<br>'}}>
      </div>
    );
  }
}

export default RoomTableCell;