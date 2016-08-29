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

/*
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
*/

export function isEmptyObject(obj){
  for (var name in obj){
    return false;
  }
  return true;
}

export function checkPrivilege(userPriv, priv){
  return (userPriv & priv) == priv;
}



export function getAbsStatus(status, type) {
  if (status == STATUS.CANCELED) {
    return STATUS.STATUS_CANCELED;
  }

  if (type == 'auto') {
    if (status == STATUS.SIMPLE_PENDING) {
      return STATUS.STATUS_PENDING;
    } else if (status == STATUS.SIMPLE_APPROVED) {
      return STATUS.STATUS_APPROVED;
    } else if (status == STATUS.SIMPLE_REJECTED) {
      return STATUS.STATUS_REJECTED;
    }
  } else if (type == 'manager') {
    if (status == STATUS.MANAGER_PENDING) {
      return STATUS.STATUS_PENDING;
    } else if (status == STATUS.MANAGER_APPROVED) {
      return STATUS.STATUS_APPROVED;
    } else if (status == STATUS.MANAGER_REJECTED) {
      return STATUS.STATUS_REJECTED;
    } else if (status == STATUS.SCHOOL_APPROVED) {
      return STATUS.STATUS_APPROVED_FIXED;
    } else if (status == STATUS.SCHOOL_REJECTED) {
      return STATUS.STATUS_REJECTED_FIXED;
    }
  } else if (type == 'school') {
    if (status == STATUS.SCHOOL_PENDING) {
      return STATUS.STATUS_PENDING;
    } else if (status == STATUS.SCHOOL_APPROVED) {
      return STATUS.STATUS_APPROVED;
    } else if (status == STATUS.SCHOOL_REJECTED) {
      return STATUS.STATUS_REJECTED;
    }
  } else {
    if (status == STATUS.SIMPLE_PENDING || status == STATUS.MANAGER_PENDING || status == STATUS.SCHOOL_PENDING) {
      return STATUS.STATUS_PENDING;
    } else if (status == STATUS.SIMPLE_APPROVED || status == STATUS.SCHOOL_APPROVED) {
      return STATUS.STATUS_APPROVED;
    } else if (status == STATUS.SIMPLE_REJECTED || status == STATUS.SCHOOL_REJECTED || status == STATUS.MANAGER_REJECTED) {
      return STATUS.STATUS_REJECTED;
    }
  }
}