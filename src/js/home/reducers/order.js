import { ORDER_UPDATE_DEPTLIST } from '../../common/constants/ActionTypes';

const initState = {
  deptList: [],
};

export default function order(state = initState, action) {
  switch(action.type) {
    case ORDER_UPDATE_DEPTLIST:
      return Object.assign({}, state, { 
        deptList: action.payload
      });
    default:
      return state;
  }
}