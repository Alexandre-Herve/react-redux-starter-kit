import rootReducer          from '../reducers';
import thunk                from 'redux-thunk';
import routes               from '../routes';
import { reduxReactRouter } from 'redux-router';
import createHistory        from 'history/lib/createBrowserHistory';
import DevTools             from '../containers/DevTools';
import {
  applyMiddleware,
  compose,
  createStore
} from 'redux';
// TODO: import middleware, use them in applyMiddleware

export default function configureStore (initialState, debug = false) {

  const middleware = applyMiddleware(thunk);
  const toComposeWith = [middleware];

  if (process.env.BROWSER) {
    toComposeWith.push(
      reduxReactRouter({ routes, createHistory })
    );
  }

  if (debug) {
    toComposeWith.push(DevTools.instrument());
  }

  const createStoreWithMiddleware = compose( ...toComposeWith );

  const store = createStoreWithMiddleware(createStore)(
    rootReducer, initialState
  );
  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers/index');

      store.replaceReducer(nextRootReducer);
    });
  }
  return store;
}
