import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';

import counter from './counter';

const rootReducer = combineReducers({
  router: routerStateReducer,
  counter
});

export default rootReducer;
