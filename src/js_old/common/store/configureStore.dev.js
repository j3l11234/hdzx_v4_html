import { createStore, applyMiddleware, compose } from 'redux';
import { persistState } from 'redux-devtools';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import { hashHistory } from 'react-router';

import DevTools from '../containers/DevTools';

const enhancer = compose(
  applyMiddleware(thunk),
  applyMiddleware(routerMiddleware(hashHistory)),
  DevTools.instrument(),
  persistState(
    window.location.href.match(
      /[?&]debug_session=([^&]+)\b/
    )
  )
);

export default function configureStore(reducer, initialState, reducerPath) {
  const store = createStore(reducer, initialState, enhancer);

  if (module.hot) {
    module.hot.accept(reducerPath, () =>
      store.replaceReducer(require(reducerPath).default)
    );
  }

  return store;
}
