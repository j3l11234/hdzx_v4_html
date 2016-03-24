import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import entities from '../../common/reducers/entities';
import user from '../../common/reducers/user';
import order from './order';
import roomTable from './roomTable';

const rootReducer = combineReducers({
  routing: routerReducer,
  entities,
  order,
  roomTable,
  user
});

export default rootReducer;
