import { 
  ROOMTABLE_UPDATE_DATELIST,
  ROOMTABLE_UPDATE_ROOMLIST,
  ROOMTABLE_UPDATE_ROOMTABLES
} from '../constants/ActionTypes';

const initState = {
  dateList: null,
  roomList: null,
  roomTables: null
};

export default function roomTable(state = initState, action) {
  switch(action.type) {
    case ROOMTABLE_UPDATE_DATELIST:
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
    default:
      return state;
  }
}