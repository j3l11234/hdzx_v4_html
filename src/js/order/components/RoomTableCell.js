import React, { Component } from 'react';

import { statusClass } from '../../common/constants/RoomTableStatus';

class RoomTableCell extends Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (this.props.roomTable.chksum !== nextProps.roomTable.chksum ||
      this.props.roomTable.available !== nextProps.roomTable.available);
  }

  getCellClass(hourTable, hour) {
    let className = statusClass[hourTable[hour]];
    if (!className) {
      className = 'z-rt-free';
    }
    return className;
  }

  onCellClick() {
    let {date, room_id, onCellClick} = this.props;
    onCellClick(date, room_id);
  }

  render() {
    let { hourTable, available, chksum } = this.props.roomTable;
    return hourTable ? (
      <div className={'rt-table-item '+ (available ? '' : 'disabled')} onClick={this.onCellClick.bind(this)} 
        dangerouslySetInnerHTML={{__html: '\
<div class="' + this.getCellClass(hourTable, 8) + '">8</div>\
<div class="' + this.getCellClass(hourTable, 9) + '">9</div>\
<div class="' + this.getCellClass(hourTable, 10) + '">10</div>\
<div class="' + this.getCellClass(hourTable, 11) + '">11</div>\
<br>\
<div class="' + this.getCellClass(hourTable, 12) + '">12</div>\
<div class="' + this.getCellClass(hourTable, 13) + '">13</div>\
<div class="' + this.getCellClass(hourTable, 14) + '">14</div>\
<br>\
<div class="' + this.getCellClass(hourTable, 15) + '">15</div>\
<div class="' + this.getCellClass(hourTable, 16) + '">16</div>\
<div class="' + this.getCellClass(hourTable, 17) + '">17</div>\
<div class="' + this.getCellClass(hourTable, 18) + '">18</div>\
<br>\
<div class="' + this.getCellClass(hourTable, 19) + '">19</div>\
<div class="' + this.getCellClass(hourTable, 20) + '">20</div>\
<div class="' + this.getCellClass(hourTable, 21) + '">21</div>\
<br>'}}>
      </div>
    ) : null;
  }
}

export default RoomTableCell;