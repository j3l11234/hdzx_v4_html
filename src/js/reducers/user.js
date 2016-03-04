import { USER_LOGIN, USER_LOGOUT } from '../constants/ActionTypes';

let initState = null;
export default function user(state = initState, action) {
  switch (action.type) {
  case USER_LOGIN:
    return action.payload;
  case USER_LOGOUT:
    return null;
  default:
    return state;
  }
}
