import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import routes from './routes';
import rootReducer from './reducers';
import configureStore from '../common/store/configureStore';
import Root from '../common/containers/Root';

const store = configureStore(rootReducer, undefined, '../../home/reducers');
const history = syncHistoryWithStore(hashHistory, store);

render(
  <Root store={store} history={history} routes={routes} />,
  document.getElementById('root')
);