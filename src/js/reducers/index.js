import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import entities from './entities';
import order from './order';
import roomTable from './roomTable';
import user from './user';
const rootReducer = combineReducers({
  routing: routerReducer,
  entities,
  order,
  roomTable,
  user
});

export default rootReducer;
