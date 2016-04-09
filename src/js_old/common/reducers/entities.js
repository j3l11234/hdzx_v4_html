import { 
  ENTITY_UPDATE_DEPT,
  ENTITY_UPDATE_LOCK,
  ENTITY_UPDATE_ORDER,
  ENTITY_UPDATE_ROOM
} from '../constants/ActionTypes';

const initState = {
  depts: {},
  locks: {},
  orders: {},
  rooms: {}
};

export default function entities(state = initState, action) {
  switch(action.type) {
    case ENTITY_UPDATE_DEPT:
      return Object.assign({}, state, { 
        depts: Object.assign({}, state.depts, action.payload)
      });
    case ENTITY_UPDATE_LOCK:
      return Object.assign({}, state, { 
        locks: Object.assign({}, state.locks, action.payload)
      });
    case ENTITY_UPDATE_ORDER:
      return Object.assign({}, state, { 
        orders: Object.assign({}, state.orders, action.payload)
      });
    case ENTITY_UPDATE_ROOM:
      return Object.assign({}, state, { 
        rooms: Object.assign({}, state.rooms, action.payload)
      });
    default:
      return state;
  }
}