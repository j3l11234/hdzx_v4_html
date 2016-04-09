import React, { Component } from 'react';
import { shouldComponentUpdate } from 'react/lib/ReactComponentWithPureRenderMixin';

class RoomTableHeader extends Component {
  constructor (props) {
    super(props);
    this.shouldComponentUpdate = shouldComponentUpdate.bind(this);
  }

  render() {
    let {dateList, onScroll} = this.props;
    return (
      <div ref="container" className="rt-date-container" onScroll={onScroll}> 
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