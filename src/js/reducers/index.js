import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import entities from './entities';
import roomTable from './roomTable';
import user from './user';
const rootReducer = combineReducers({
  routing: routerReducer,
  entities,
  roomTable,
  user
});

export default rootReducer;
