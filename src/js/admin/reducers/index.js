import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import entities from '../../common/reducers/entities';
import user from '../../common/reducers/user';
import approve from './approve';

const rootReducer = combineReducers({
  routing: routerReducer,
  approve,
  entities,
  user
});

export default rootReducer;
