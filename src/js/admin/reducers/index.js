import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import entities from '../../common/reducers/entities';
import roomTable from '../../common/reducers/roomTable';
import user from '../../common/reducers/user';
import approve from './approve';

const rootReducer = combineReducers({
  routing: routerReducer,
  approve,
  entities,
  roomTable,
  user
});

export default rootReducer;
