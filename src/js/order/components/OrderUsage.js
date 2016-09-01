import React, { Component } from 'react';
import { shouldComponentUpdate } from 'react/lib/ReactComponentWithPureRenderMixin';

import Form from './OrderForm';
import OrderList from './OrderOrderList';
import LockList from './OrderLockList';

class Usage extends Component {
  constructor (props) {
    super(props);
    this.shouldComponentUpdate = shouldComponentUpdate.bind(this);

    this.state = {
    }
  }

  render () {
    let { monthUsage, weekUsage } = this.props;

    weekUsage = weekUsage ? weekUsage : {};
    monthUsage = monthUsage ? monthUsage : {}
    let weekTotal = weekUsage.used + weekUsage.ordered + weekUsage.avl;
    let weekUsed = weekUsage.used * 100.0 / weekTotal;
    let weekOrdered = weekUsage.ordered * 100.0 / weekTotal;
    let monthTotal = monthUsage.used + monthUsage.ordered + monthUsage.avl;
    let monthUsed = monthUsage.used * 100.0 / monthTotal;
    let monthOrdered = monthUsage.ordered * 100.0 / monthTotal;

    return (
      <div>
        <br />
        <label>本周额度：</label>
        <p>本周已通过申请{weekUsage.used}小时，审批中申请{weekUsage.ordered}小时，剩余可用时长{weekUsage.avl}小时。</p>
        <div className="progress">
          <div className="progress-bar progress-bar-danger progress-bar-striped" style={{width: weekUsed.toFixed(2)+'%'}} />
          <div className="progress-bar progress-bar-warning progress-bar-striped" style={{width: weekOrdered.toFixed(2)+'%'}} />
        </div>
        <hr />
        <label>本月额度：</label>
        <p>本月已通过申请{monthUsage.used}小时，审批中申请{monthUsage.ordered}小时，剩余可用时长{monthUsage.avl}小时。</p>
        <div className="progress">
          <div className="progress-bar progress-bar-danger progress-bar-striped" style={{width: monthUsed.toFixed(2)+'%'}} />
          <div className="progress-bar progress-bar-warning progress-bar-striped" style={{width: monthOrdered.toFixed(2)+'%'}} />
        </div>
      </div>
    );
  }
}
export default Usage;