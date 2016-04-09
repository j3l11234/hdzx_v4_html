import { ORDER_UPDATE_DEPTLIST } from '../../common/constants/ActionTypes';

export function updateDeptList(deptList) {
	return {type: ORDER_UPDATE_DEPTLIST, payload: deptList};
}
