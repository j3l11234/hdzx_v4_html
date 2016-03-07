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