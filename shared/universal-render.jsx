import Iso from 'iso';
import debug from 'debug';
import React from 'react';
import { Provider }             from 'react-redux';
import { ReduxRouter }          from 'redux-router';
import { renderToString } from 'react-dom/server';
import configureStore from '../src/store/configureStore';
import createLocation from 'history/lib/createLocation';
import { RoutingContext, match } from 'react-router';

const runRouter = (location, routes) =>
  new Promise((resolve) =>
    match({ routes, location }, (...args) => resolve(args)));

export default async function(url) {
  const location = createLocation(url);
  const routes = require('../src/routes');
  const [ error, redirect, renderProps ] = await runRouter(location, routes);

  if (error || redirect) throw ({ error, redirect });

  const store = configureStore({});


  // TODO: add renderDevTools ?
  const element = (
    <Provider store={store}>
      <RoutingContext { ...renderProps } />
    </Provider>
  );

  let app;
  let state;
  try {
    // TODO: wait for store for async
    // Collect promises with a first render
    debug('dev')('first server render');
    app = renderToString(element);
    state = store.getState();

  } catch (renderErr) {
    console.log('renderErr', renderErr);

  }

  // const { title } = flux.getStore('title').getState();
  return Iso.render(app, state);
}
