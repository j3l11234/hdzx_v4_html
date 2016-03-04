import React from 'react';
import { Route } from 'react-router';

import App from './containers/App';
import Login from './containers/LoginPage';

const routes = (
  <Route path="/" component={App}>
  	<Route path="login" component={Login} />
  </Route>
);

export default routes;