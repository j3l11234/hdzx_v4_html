import React from 'react';
import { Route } from 'react-router';

import App from './containers/App';
import Login from './containers/LoginPage';
import Order from './containers/OrderPage';
const routes = (
  <Route path="/" component={App}>
  	<Route path="login" component={Login} />
  	<Route path="order" component={Order} />
  </Route>
);

export default routes;