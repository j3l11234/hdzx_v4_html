import React from 'react';
import { Route } from 'react-router';

import App from './containers/App';
import Login from './containers/LoginPage';
import Approve from './containers/ApprovePage';

const routes = (
  <Route path="/" component={App}>
  	<Route path="login" component={Login} />
  	<Route path="approve/:type" component={Approve} />
  </Route>
);

export default routes;