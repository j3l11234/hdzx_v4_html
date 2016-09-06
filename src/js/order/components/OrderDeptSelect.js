import React, { Component } from 'react';
import { shouldComponentUpdate } from 'react/lib/ReactComponentWithPureRenderMixin';

import { STATUS, statusClass } from '../../common/constants/RoomTableStatus';

class OrderDeptSelect extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = shouldComponentUpdate.bind(this);
   
    this.state = {
      select_dept: 0,
    };
  }

  onSelect(e) {
    if (e.target.value == -1) {
      return;
    }
    this.setState({
      select_dept: e.target.value
    });
  }

  setSelect(select_dept){
    this.setState({
      select_dept
    });
  }

  valadate() {
    let dept = this.props.depts[this.state.select_dept];
    if(dept && dept.choose == 1){
      return true;
    }else {
      return false;
    }
  }

  getSelect(){
    return this.state.select_dept;
  }

  renderSelect(index, deptList, depts, parent_dept, select_dept) {
    let parent = depts[parent_dept];
    return (
      <select key={index} className="select-dept form-control"
        value={select_dept} onChange={this.onSelect.bind(this)}>
        { parent && parent.choose == 1 ? <option value={parent.id}>{parent.name}</option> : <option value={index == 0 ? 0 : -1}>请选择</option>}
        { deptList.map(dept_id => {
          let dept = depts[dept_id];
          return (
            <option key={dept_id} value={dept_id}>{dept.name}</option>
          );
        }) }
      </select>
    )
  }

  render() {
    let { depts, deptMap } = this.props;
    let { select_dept } = this.state;

    //根据select_dept逆推到根节点
    let selects = [];
    if(depts){
      selects[0] = select_dept;
      for (var i = 0; selects[i] != 0 && i < 100; i++) {
        let parent_dept = depts[selects[i]];
        if(parent_dept){
          selects[i+1] = parent_dept.parent_id;
        }
      }
    }

    //根据根节点渲染
    let selectEls = [];
    if (deptMap) {
      for (var i = selects.length - 1; i >= 0; i--) {
        let deptList = deptMap[selects[i]];
        deptList && deptList.length > 0 && selectEls.push(this.renderSelect(selects.length-i-1,deptList,depts,selects[i], selects[i-1]));
      }
    }

    return (
      <div className="inline-control">
        {selectEls}
      </div>
    );
  }
}

export default OrderDeptSelect;