import React from 'react';
import createHistory from 'history/createBrowserHistory';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router';
import { ConnectedRouter as Router, routerMiddleware } from 'react-router-redux';
import { configureStore } from '../shared/redux/store';
import Character from '../shared/character/Character';
import Home from '../shared/home/components/Home';

const browserHistory = window.browserHistory || createHistory();
const store =
  window.store ||
  configureStore({
    initialState: window.__PRELOADED_STATE__,
    middleware: [routerMiddleware(browserHistory)],
  });

hydrate(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Switch>
        <Route path="/characters/:slug" component={Character} />
        <Route exact path="/" component={Home} />
      </Switch>
    </Router>
  </Provider>,
  document.getElementById('app')
);

if (process.env.NODE_ENV === 'development') {
  if (module.hot) {
    module.hot.accept();
  }

  if (!window.store || !window.browserHistory) {
    window.browserHistory = browserHistory;
    window.store = store;
  }
}
