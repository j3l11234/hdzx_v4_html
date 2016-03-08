import shallowEqual from 'fbjs/lib/shallowEqual';

import { 
  ROOMTABLE_UPDATE_DATELIST,
  ROOMTABLE_UPDATE_ROOMLIST,
  ROOMTABLE_UPDATE_ROOMTABLES,
  ROOMTABLE_UPDATE_ONEROOMTABLE
} from '../constants/ActionTypes';

const initState = {
  dateList: null,
  roomList: null,
  roomTables: null
};

export default function roomTable(state = initState, action) {
  switch(action.type) {
    case ROOMTABLE_UPDATE_DATELIST:
      if(shallowEqual(state.dateList, action.payload)){
        return state;
      }
      return Object.assign({}, state, { 
        dateList: action.payload
      });
    case ROOMTABLE_UPDATE_ROOMLIST:
      return Object.assign({}, state, { 
        roomList: action.payload
      });
    case ROOMTABLE_UPDATE_ROOMTABLES:
      return Object.assign({}, state, { 
        roomTables: action.payload
      });
    case ROOMTABLE_UPDATE_ONEROOMTABLE:
      let {room, date, roomTable} = action.payload;
      let newRoom = {};
      let newRoomTables = {};
      newRoom[date] = roomTable;
      newRoom = Object.assign({}, state.roomTables[room], newRoom);
      newRoomTables[room] = newRoom;
      return Object.assign({}, state, {
        roomTables: Object.assign({}, state.roomTables, newRoomTables)
      });  
    default:
      return state;
  }
}