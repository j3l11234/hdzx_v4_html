import { ajaxGet, ajaxPost } from './AjaxApi';
// import urls from '../constants/Urls';

const URL = _Server_Data_.BASE_URL;

export const Data = {
  getData: function(page, type) {
    return ajaxGet(URL + 'data/getdata' +
      '?page=' + page +
      '&type=' + type);
  }
};

export const Order = {
  getRoomTables: function(start_date, end_date, rooms) {
    return ajaxGet(URL + 'order/getroomtables' +
      '?start_date=' + start_date +
      '&end_date=' + end_date +
      '&rooms=' + (rooms ? JSON.stringify(rooms) : ''));
  },
  getRoomUse: function(date, room_id) {
    return ajaxGet(URL + 'order/getroomuse' + 
      '?date=' + date +
      '&room=' + room_id);
  },
  getUsage: function(date) {
    return ajaxGet(URL + 'order/getusage' + 
      '?date=' + date);
  },
  getCaptcha: function() {
    return ajaxGet(URL + 'order/captcha?refresh=1');
  },
  submitOrder: function(data) {
    return ajaxPost(URL + 'order/submitorder', data);
  },
  getIssueOrders: function(username, start_date, end_date) {
    return ajaxGet(URL + 'order/getissueorders' +
      '?username=' + username +
      '&start_date=' + start_date +
      '&end_date=' + end_date);
  },
  issueOrder: function(order_id) {
    return ajaxPost(URL + 'order/issueorder', {order_id});
  },
  getMyOrders: function(start_date, end_date) {
    return ajaxGet(URL + '/order/getmyorders' +
      '?start_date=' + start_date +
      '&end_date=' + end_date);
  },
  cancelOrder: function(order_id) {
    return ajaxPost(URL + 'order/cancelorder' +
      '?order_id=' + order_id, null);
  },
  paperOrder: function(order_id) {
    return ajaxPost(URL + 'order/paperorder' +
      '?order_id=' + order_id, null);
  },
  updateOrderExt: function(order_id, data) {
    return ajaxPost(URL + 'order/updateorderext' +
      '?order_id=' + order_id, data);
  }
};

export const User = {
  login: function(data) {
    return ajaxPost(URL + 'user/login', data);
  },
  getLogin: function() {
    return ajaxGet(URL + 'user/getlogin');
  }
};

export const Approve = {
  getOrders: function(type, start_date, end_date) {
    return ajaxGet(URL + 'approve/getorders' +
      '?type=' + type +
      '&start_date=' + start_date +
      '&end_date=' + end_date);
  },
  approveOrder: function(type, data) {
    return ajaxPost(URL + 'approve/approveorder' +
      '?type=' + type, data);
  },
  rejectOrder: function(type, data) {
    return ajaxPost(URL + 'approve/rejectorder' +
      '?type=' + type, data);
  },
  revokeOrder: function(type, data) {
    return ajaxPost(URL + 'approve/revokeorder' +
      '?type=' + type, data);
  },
};

export const Lock = {
  getLocks: function() {
    return ajaxGet(URL + 'lock/getlocks');
  },
  submitLock: function(data) {
    return ajaxPost('lock/submitlock', data);
  },
  deleteLock: function(lock_id) {
    return ajaxPost('lock/deletelock', {lock_id});
  },
  applyLocks: function(data) {
    return ajaxPost('lock/applylock', data);
  }
};



// export function meta_getDepts(dispatch){
//   return fetchGet(dispatch, urls.base + urls.order.getdepts, false);
// }


// export function user_getLogin(dispatch){
//   return fetchGet(dispatch, urls.base + urls.user.getlogin, false);
// };

// export function user_login(dispatch, username, password, remenber_me) {
//   return fetchPost(dispatch, urls.base + urls.user.login, {
//       username,
//       password,
//       remenber_me
//     });
// };

// export function user_logout(dispatch) {
//   return fetchPost(dispatch, urls.base + urls.user.logout, null);
// };

// export function order_getRoomTables(dispatch) {
//   return fetchGet(dispatch, urls.base + urls.order.getroomtables);
// };

// export function order_submitOrder(dispatch, data) {
//   return fetchPost(dispatch, urls.base + urls.order.submitorder, data);
// };

// export function order_getRoomUse(dispatch, room, date) {
//     return fetchGet(dispatch, urls.base + urls.order.getroomuse+'?room='+room+'&date='+date);
// };

// export function order_captcha(dispatch) {
//     return fetchGet(dispatch, urls.base + urls.order.captcha+'?refresh=1&r='+Math.random());
// };


// export function approve_getOrder(dispatch, type) {
//     return fetchGet(dispatch, urls.base + urls.approve.getorder+'?type='+type);
// };

// export function approve_approveOrder(dispatch, type, order_id, comment) {
//     return fetchPost(dispatch, urls.base + urls.approve.approveorder+'?type='+type, {
//       order_id,
//       comment
//     });
// };

// export function approve_rejectOrder(dispatch, type, order_id, comment) {
//     return fetchPost(dispatch, urls.base + urls.approve.rejectorder+'?type='+type, {
//       order_id,
//       comment
//     });
// };

// export function approve_revokeOrder(dispatch, type, order_id, comment) {
//     return fetchPost(dispatch, urls.base + urls.approve.revokeorder+'?type='+type, {
//       order_id,
//       comment
//     });
// };