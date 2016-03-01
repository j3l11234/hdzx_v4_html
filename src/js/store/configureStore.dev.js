import { createStore, applyMiddleware, compose } from 'redux';
import { persistState } from 'redux-devtools';
import thunk from 'redux-thunk';
import { createHashHistory } from 'history';
import { reduxReactRouter } from 'redux-router';

import rootReducer from '../reducers';
import routes from '../constants/routes';
import DevTools from '../containers/DevTools';

const enhancer = compose(
  applyMiddleware(thunk),
  reduxReactRouter({
    routes,
    createHistory: createHashHistory
  }),
  DevTools.instrument(),
  persistState(
    window.location.href.match(
      /[?&]debug_session=([^&]+)\b/
    )
  )
);

export default function configureStore(initialState) {
  const store = createStore(rootReducer, initialState, enhancer);

  if (module.hot) {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(require('../reducers').default)
    );
  }

  return store;
}
