import React, { Component } from 'react';
import { shouldComponentUpdate } from 'react/lib/ReactComponentWithPureRenderMixin';

class Pagination extends Component {
  constructor (props) {
    super(props);
    this.shouldComponentUpdate = shouldComponentUpdate.bind(this);
  }

  onPageClick(page, e) {
    this.props.onPageClick(page);
  }

  getPageRange(totalPage, length, cur) {
    //计算左右延长
    let left = Math.floor((length - 1) / 2);
    let right = length - (left + 1);

    //计算起始
    let start,end;
    if (cur < 1 + left) {
      start = 1;
      end = length;
    } else if(cur > totalPage - right) {
      start = totalPage - length + 1;
      end = totalPage;
    } else {
      start = cur - left;
      end = cur + right;
    }
    start = Math.max(start, 1);
    end = Math.min(end, totalPage);

    return {start, end};
  }

  render() {
    let { length, total, per, cur } = this.props;
    let totalPage = Math.ceil(total/per);
    let {start, end} = this.getPageRange(totalPage, length, cur);
    let pageList = [];
    for (var i = start; i <= end; i++) {
      pageList.push(i);
    }

    return (
      <nav className="text-center">
        <ul className="pagination">
          {
            totalPage > length ? (
              <li className={cur <= 1 ? 'disabled' : ''}>
                <a onClick={this.onPageClick.bind(this,1)}>{1+'…'}</a>
              </li>
            ): null
          }
          <li className={cur <= 1 ? 'disabled' : ''}>
            <a onClick={this.onPageClick.bind(this,cur-1)} aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
          {
            pageList.map(page => {
              return (
                <li key={page} className={page == cur ? 'active' : ''} >
                  <a onClick={page == cur ? null : this.onPageClick.bind(this,page)}>{page}</a>
                </li>
              );
            })
          }
          <li className={cur >= totalPage ? 'disabled' : ''}>
            <a onClick={this.onPageClick.bind(this,cur+1)} aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
          {
            totalPage > length ? (
              <li className={cur >= totalPage ? 'disabled' : ''}>
                <a onClick={this.onPageClick.bind(this,totalPage)}>{'…'+totalPage}</a>
              </li>
            ): null
          }
        </ul>
      </nav>
    );
  }
}

Pagination.getLimit = (cur, total, per) => {
  let start = (cur-1) * per;
  start = Math.max(0, start);
  let end = start+per;
  end = Math.min(total, end)
  return { start,end };
}
export default Pagination;
