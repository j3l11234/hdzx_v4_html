import { fetchGet, fetchPost } from '../helpers/FetchApi';
import urls from '../constants/Urls';

export function meta_getRooms(dispatch){
  return fetchGet(dispatch, urls.base + urls.order.getrooms, false);
}

export function meta_getDepts(dispatch){
  return fetchGet(dispatch, urls.base + urls.order.getdepts, false);
}


export function user_getLogin(dispatch){
  return fetchGet(dispatch, urls.base + urls.user.getlogin, false);
};

export function user_login(dispatch, username, password, remenber_me) {
  return fetchPost(dispatch, urls.base + urls.user.login, {
      username,
      password,
      remenber_me
    });
};

export function user_logout(dispatch) {
  return fetchPost(dispatch, urls.base + urls.user.logout, null);
};


export function order_getRoomTables(dispatch) {
  return fetchGet(dispatch, urls.base + urls.order.getroomtables);
};

export function order_submitOrder(dispatch, data) {
  return fetchPost(dispatch, urls.base + urls.order.submitorder, data);
};

export function order_getRoomUse(dispatch, room, date) {
    return fetchGet(dispatch, urls.base + urls.order.getroomuse+'?room='+room+'&date='+date);
};

export function order_captcha(dispatch) {
    return fetchGet(dispatch, urls.base + urls.order.captcha+'?refresh=1');
};


export function approve_getOrder(dispatch, type) {
    return fetchGet(dispatch, urls.base + urls.approve.getorder+'?type='+type);
};

export function approve_approveOrder(dispatch, type, order_id, comment) {
    return fetchPost(dispatch, urls.base + urls.approve.approveorder+'?type='+type, {
      order_id,
      comment
    });
};

export function approve_rejectOrder(dispatch, type, order_id, comment) {
    return fetchPost(dispatch, urls.base + urls.approve.rejectorder+'?type='+type, {
      order_id,
      comment
    });
};

export function approve_revokeOrder(dispatch, type, order_id, comment) {
    return fetchPost(dispatch, urls.base + urls.approve.revokeorder+'?type='+type, {
      order_id,
      comment
    });
};