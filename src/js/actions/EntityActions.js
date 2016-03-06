import { ENTITY_UPDATE_ROOM, ENTITY_UPDATE_DEPT } from '../constants/ActionTypes';

export function updateRoom(rooms) {
  return {type: ENTITY_UPDATE_ROOM, payload: rooms};
};

export function updateDept(depts) {
  return {type: ENTITY_UPDATE_DEPT, payload: depts};
};