import React, { Component } from 'react';
import {shouldComponentUpdate} from 'react-addons-pure-render-mixin';

class RoomTableHeader extends Component {
  constructor (props) {
    super(props);
    this.shouldComponentUpdate = shouldComponentUpdate.bind(this);
  }

  render() {
    let {dateList} = this.props;
    return (
      <div className="rt-date-container"> 
        <div className="rt-date-row">
        {
          dateList && dateList.map(date => {
            return (
              <div key={date} className="rt-date-item">
                {date}
              </div>
            );
          })
        }
        </div>
      </div>
    );
  }
}

export default RoomTableHeader;