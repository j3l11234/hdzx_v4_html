import { fetchGet } from '../helpers/FetchApi';
import urls from '../constants/Urls';
import { ENTITY_UPDATE_ROOM, ENTITY_UPDATE_DEPT, USER_LOGIN } from '../constants/ActionTypes';

export function getInitData() {
  return dispatch => {
    fetchGet(dispatch, urls.base + urls.order.getrooms, data => {
      const { roomList, rooms } = data;
      dispatch({type: ENTITY_UPDATE_ROOM, payload: rooms});
    }, false);
    fetchGet(dispatch, urls.base + urls.order.getdepts, data => {
      const { deptList, depts } = data;
      dispatch({type: ENTITY_UPDATE_DEPT, payload: depts});
    }, false);

    fetchGet(dispatch, urls.base + urls.user.getlogin, data => {
      const { user } = data;
      user && dispatch({type: USER_LOGIN, payload: user});
    }, false);
  }
}