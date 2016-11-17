import React, { Component } from 'react';

import { statusClass } from '../../common/constants/RoomTableStatus';

class RoomTableCell extends Component {
  constructor(props) {
    super(props);

    this._onCellClick = this.onCellClick.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (this.props.roomTable.chksum !== nextProps.roomTable.chksum) || 
      (this.props.roomTable.status !== nextProps.roomTable.status);
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
    let { hourTable, status, chksum,period } = this.props.roomTable;

    let caption;
    if (status == 'UPCOMING') {
      caption = (<div className="caption">
        <div className="text">{(new Date(period.start*1000)).Format('yyyy-MM-dd hh:mm:ss')}<br />开放申请</div>   
      </div>);
    } else if(status == 'MISSED') {
      caption = (<div className="caption">
        <div className="text">该时段<br />不可申请</div>   
      </div>);
    }

    return hourTable ? (
      <div className={'rt-table-cell ' + (status == 'ACTIVE' ? '' :' disabled')} onClick={this._onCellClick} >
        <div className="content" dangerouslySetInnerHTML={{__html: '\
<div class="cell ' + this.getCellClass(hourTable, 8) + '">8</div>\
<div class="cell ' + this.getCellClass(hourTable, 9) + '">9</div>\
<div class="cell ' + this.getCellClass(hourTable, 10) + '">10</div>\
<div class="cell ' + this.getCellClass(hourTable, 11) + '">11</div>\
<br>\
<div class="cell ' + this.getCellClass(hourTable, 12) + '">12</div>\
<div class="cell ' + this.getCellClass(hourTable, 13) + '">13</div>\
<div class="cell ' + this.getCellClass(hourTable, 14) + '">14</div>\
<br>\
<div class="cell ' + this.getCellClass(hourTable, 15) + '">15</div>\
<div class="cell ' + this.getCellClass(hourTable, 16) + '">16</div>\
<div class="cell ' + this.getCellClass(hourTable, 17) + '">17</div>\
<div class="cell ' + this.getCellClass(hourTable, 18) + '">18</div>\
<br>\
<div class="cell ' + this.getCellClass(hourTable, 19) + '">19</div>\
<div class="cell ' + this.getCellClass(hourTable, 20) + '">20</div>\
<div class="cell ' + this.getCellClass(hourTable, 21) + '">21</div>\
<br>'}} />
        {caption}  
      </div>
    ) : null;
  }
}

export default RoomTableCell;