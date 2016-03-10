import { 
	APPROVE_UPDATE_DEPTLIST,
	APPROVE_UPDATE_ORDERLIST
} from '../constants/ActionTypes';

export function updateDeptList(deptList) {
	return {type: APPROVE_UPDATE_DEPTLIST, payload: deptList};
}

export function updateOrderList(orderList) {
	return {type: APPROVE_UPDATE_ORDERLIST, payload: orderList};
}
