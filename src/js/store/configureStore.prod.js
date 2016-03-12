import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import { hashHistory } from 'react-router';
import thunk from 'redux-thunk';

import rootReducer from '../reducers';

const enhancer = compose(
  applyMiddleware(thunk),
  applyMiddleware(routerMiddleware(hashHistory))
);

export default function configureStore(initialState) {
  return createStore(rootReducer, initialState, enhancer);
}
