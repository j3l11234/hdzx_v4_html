import { ajaxGet, ajaxPost } from './AjaxApi';
// import urls from '../constants/Urls';

const URL = '';

export const Data = {
  getData: function(page) {
    return ajaxGet(URL + 'data/getdata' +
      '?page=' + page);
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
    return ajaxGet('order/captcha?refresh=1');
  },
  submitOrder: function(data) {
    return ajaxPost('order/submitorder', data);
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