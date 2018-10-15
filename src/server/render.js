import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import Html from './components/HTML';

const render = (req, res, component, props) => {
  console.log(res.locals.assetPath('bundle.css'));
  const $component = component;
  const jsx = renderToString(
    <Provider store={req.store}>
      <Router location={req.url} context={{}}>
        <$component {...props} />
      </Router>
    </Provider>
  );
  const state = JSON.stringify(req.store.getState());
  return res.send(
    '<!doctype html>' +
      renderToString(
        <Html
          css={[res.locals.assetPath('bundle.css'), res.locals.assetPath('vendor.css')]}
          scripts={[res.locals.assetPath('bundle.js'), res.locals.assetPath('vendor.js')]}
          state={state}
        >
          {jsx}
        </Html>
      )
  );
};

const serverRenderer = (component, props) => (req, res) => {
  return render(req, res, component, props);
};

export default serverRenderer;
