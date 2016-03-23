import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import { hashHistory } from 'react-router';
import thunk from 'redux-thunk';

const enhancer = compose(
  applyMiddleware(thunk),
  applyMiddleware(routerMiddleware(hashHistory))
);

export default function configureStore(reducer, initialState) {
  return createStore(reducer, initialState, enhancer);
}
