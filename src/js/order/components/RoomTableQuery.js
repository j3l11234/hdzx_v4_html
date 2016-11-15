import React, { Component } from 'react';
import { shouldComponentUpdate } from 'react/lib/ReactComponentWithPureRenderMixin';

import FormAlert from '../../common/components/FormAlert';
import FormValidator from '../../common/units/FormValidator_';

class RoomTableQuery extends Component {
  constructor (props) {
    super(props);
    this.shouldComponentUpdate = shouldComponentUpdate.bind(this);

    this.state = {
      alert: null,
    }
  }
  
  componentWillMount() {
    this.fv = new FormValidator((()=>{
      return this.state;
    }).bind(this),this.setState.bind(this));
    this.fv.setInputs({
      start_date: {
        value: '',
        validator: (value) => {
          if(value !== '' && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            return  '开始日期格式错误';
          }
        }
      },
      end_date: {
        value: '',
        validator: (value) => {
          if(value !== '' && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            return  '结束日期格式错误';
          }
        }
      },
    });
  }

  handleChange (name, event) {
    this.fv.handleChange(name, event);
  }

  onQeury (e) {
    e && e.preventDefault();
    let fields = ['start_date', 'end_date'];
    let errors = this.fv.validateInputs(fields);

    if(errors.length > 0) {
      this.setState({
        alert: {style: 'danger', text: errors[0].error}
      });
      return;
    }

    let formData = this.fv.getInputValues(fields);
    this.setState({
      alert: null,
      loading: true
    });
    this.props.onQeury(formData.start_date, formData.end_date).then(data => {
      this.setState({loading: false});
    }, data => {
      this.setState({
        loading: false,
        alert: { style: 'danger', text: data.message}
      });
    })
  }

  onFilterClick(e) {
    let perPage = parseInt(this.refs.perPage.value);
    this.props.onFilter(perPage);
  }

  getBsStyle (name) {
    if(!this.fv.getInputError(name)){
      return null;
    }else{
      return 'has-error';
    }
  }

  render() {
    return (
      <form onSubmit={this.onQeury.bind(this)}>
        <div className="row">
          <div className={'form-group col-sm-6 col-md-4 '+this.getBsStyle.call(this, 'start_date')}>
            <label className="control-label inline-label">开始日期</label>
            <div className="input-group">
              <input type="date" placeholder="开始日期" className="form-control" onChange={this.handleChange.bind(this, 'start_date')} value={this.fv.getInputValue('start_date')} />
              <span className="input-group-addon"><span className="glyphicon glyphicon-calendar" /></span>
            </div>
          </div>
          <div className={'form-group col-sm-6 col-md-4 '+this.getBsStyle.call(this, 'end_date')}>
            <label className="control-label inline-label">结束日期</label>
            <div className="input-group">
              <input type="date" placeholder="结束日期" className="form-control" onChange={this.handleChange.bind(this, 'end_date')} value={this.fv.getInputValue('end_date')} />
              <span className="input-group-addon"><span className="glyphicon glyphicon-calendar" /></span>
            </div>
          </div>
          <div className="form-group col-sm-6 col-md-4">
            <button type="submit" className="btn-block btn btn-primary" disabled={this.state.loading}>查找</button>
          </div>
          <div className="col-md-12">
            {this.state.alert?(<FormAlert style={this.state.alert.style} text={this.state.alert.text}/>):null}
          </div>
          <div className="col-sm-12">
            <hr className="small" />
          </div> 
          <div className="form-group col-sm-6 col-md-4">
            <label className="control-label inline-label">显示图例</label>
            <div className="inline-control">
              <div className="rt-legend z-rt-free">正常</div>
              <div className="rt-legend z-rt-ordered">申请</div>
              <div className="rt-legend z-rt-used">占用</div>
              <div className="rt-legend z-rt-locked">锁定</div>
            </div>
          </div>
          <div className="form-group col-sm-6 col-md-4">
            <label className="control-label inline-label">每页显示</label>
            <div className="inline-control">
              <input ref="perPage" type="text" placeholder="每页显示" className="form-control" defaultValue="8" />
            </div>
          </div>
          <div className="form-group col-sm-6 col-md-4">
            <button type="button" className="btn-block btn btn-success" onClick={this.onFilterClick.bind(this)}>筛选</button>
          </div>
        </div>
      </form>
    );
  }
}
export default RoomTableQuery;