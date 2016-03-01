import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createHashHistory } from 'history';
import { reduxReactRouter } from 'redux-router';

import rootReducer from '../reducers';
import routes from '../constants/routes';

const enhancer = compose(
  applyMiddleware(thunk),
  reduxReactRouter({
    routes,
    createHistory: createHashHistory
  })
);

export default function configureStore(initialState) {
  return createStore(rootReducer, initialState, enhancer);
}
