import { 
	ENTITY_UPDATE_ROOM,
	ENTITY_UPDATE_DEPT,
	ENTITY_UPDATE_ORDER,
	ENTITY_UPDATE_LOCK
} from '../../common/constants/ActionTypes';

export function updateRoom(rooms) {
  return {type: ENTITY_UPDATE_ROOM, payload: rooms};
};

export function updateDept(depts) {
  return {type: ENTITY_UPDATE_DEPT, payload: depts};
};

export function updateOrder(orders) {
  return {type: ENTITY_UPDATE_ORDER, payload: orders};
};

export function updateLock(locks) {
  return {type: ENTITY_UPDATE_LOCK, payload: locks};
};