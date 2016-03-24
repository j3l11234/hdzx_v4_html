import {STATUS} from '../constants/OrderStatus';

export function getListFormTable (table, hours) {
  var ids = {};
  var idList = [];
  for(var hour in table) {
    if(!hours || hours.indexOf(parseInt(hour)) != -1) {
      for(var key in table[hour]) {
        ids[table[hour][key]] = true;
      }
    }
  }
  for(var id in ids) {
    idList.push(id);
  }
  return idList;
}

export function getDateRange(max_before, min_before, by_week, now) {
  max_before = parseInt(max_before);
  min_before = parseInt(min_before);

  let today = now ? now : new Date();
  today.setHours(0,0,0);

  let day = today.getDate();
  let limitStart = new Date(today);
  limitStart.setDate(day + min_before);
  let limitEnd = new Date(today);
  limitEnd.setDate(day + max_before);

  if (by_week == 1){
    let weekDay = limitEnd.getDay()
    max_before += (7 - weekDay) % 7;  
    limitEnd = new Date(today);
    limitEnd.setDate(day + max_before);
  }

  return {
    start: limitStart.Format('yyyy-MM-dd'),
    end: limitEnd.Format('yyyy-MM-dd')
  };
}

export function isEmptyObject(obj){
  for (var name in obj){
    return false;
  }
  return true;
}


export function getAbstractStatus(status, type) {
  if (type == 'auto') {
    if (status == STATUS.AUTO_PENDING) {
      return STATUS.STATUS_PENDING;
    } else if (status == STATUS.AUTO_APPROVED) {
      return STATUS.STATUS_APPROVED;
    } else if (status == STATUS.AUTO_REJECTED) {
      return STATUS.STATUS_REJECTED;
    }
  } else if (type == 'manager') {
    if (status == STATUS.MANAGER_PENDING) {
      return STATUS.STATUS_PENDING;
    } else if (status == STATUS.MANAGER_APPROVED) {
      return STATUS.STATUS_APPROVED;
    } else if (status == STATUS.MANAGER_REJECTED) {
      return STATUS.STATUS_REJECTED;
    }
  } else if (type == 'school') {
    if (status == STATUS.SCHOOL_PENDING) {
      return STATUS.STATUS_PENDING;
    } else if (status == STATUS.SCHOOL_APPROVED) {
      return STATUS.STATUS_APPROVED;
    } else if (status == STATUS.SCHOOL_REJECTED) {
      return STATUS.STATUS_REJECTED;
    }
  }
}

// 对Date的扩展，将 Date 转化为指定格式的String   
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
// 例子：   
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18  
//author: meizz    
Date.prototype.Format = function(fmt) { 
  var o = {   
    "M+" : this.getMonth()+1,                 //月份 
    "d+" : this.getDate(),                    //日 
    "h+" : this.getHours(),                   //小时 
    "m+" : this.getMinutes(),                 //分 
    "s+" : this.getSeconds(),                 //秒 
    "q+" : Math.floor((this.getMonth()+3)/3), //季度 
    "S"  : this.getMilliseconds()             //毫秒 
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}

