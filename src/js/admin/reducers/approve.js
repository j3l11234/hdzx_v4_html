import { 
	APPROVE_UPDATE_DEPTLIST,
	APPROVE_UPDATE_ORDERLIST
} from '../../common/constants/ActionTypes';

const initState = {
  deptList: [],
  orderList: [],
};

export default function approve(state = initState, action) {
  switch(action.type) {
    case APPROVE_UPDATE_DEPTLIST:
      return Object.assign({}, state, { 
        deptList: action.payload
      });
    case APPROVE_UPDATE_ORDERLIST:
    	return Object.assign({}, state, { 
        orderList: action.payload
      });
    default:
      return state;
  }
}