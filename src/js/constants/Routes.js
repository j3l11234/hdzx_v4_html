import React from 'react';
import { Route } from 'react-router';

import CounterApp from '../containers/CounterApp';

const routes = (
  <Route path="/">
    <Route path="CounterApp" component={CounterApp} />
  </Route>
);

export default routes;