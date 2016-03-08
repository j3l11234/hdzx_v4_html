import { 
  ROOMTABLE_UPDATE_DATELIST,
  ROOMTABLE_UPDATE_ROOMLIST,
  ROOMTABLE_UPDATE_ROOMTABLES,
  ROOMTABLE_UPDATE_ONEROOMTABLE
} from '../constants/ActionTypes';

export function updateDateList(dateList) {
	return {type: ROOMTABLE_UPDATE_DATELIST, payload: dateList};
}

export function updateRoomList(roomList) {
	return {type: ROOMTABLE_UPDATE_ROOMLIST, payload: roomList};
}

export function updateRoomTables(roomTables) {
	return {type: ROOMTABLE_UPDATE_ROOMTABLES, payload: roomTables};
}

export function updateOneRoomTable(room, date, roomTable) {
	return {type: ROOMTABLE_UPDATE_ONEROOMTABLE, payload: {
		room,
		date,
		roomTable
	}};
}