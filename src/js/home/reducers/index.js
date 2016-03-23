import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import entities from '../../common/reducers/entities';
import roomTable from '../../common/reducers/roomTable';
import user from '../../common/reducers/user';
import order from './order';


const rootReducer = combineReducers({
  routing: routerReducer,
  entities,
  order,
  roomTable,
  user
});

export default rootReducer;
