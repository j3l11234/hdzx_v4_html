import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import entities from './entities';
import user from './user';
const rootReducer = combineReducers({
  routing: routerReducer,
  entities,
  user
});

export default rootReducer;
