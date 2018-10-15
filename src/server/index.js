// import React from 'react';
import express from 'express';
import cors from 'cors';
import path from 'path';
import chalk from 'chalk';
import manifestHelpers from 'express-manifest-helpers';
import bodyParser from 'body-parser';
import { configureStore } from '../shared/redux/store';
import serverRender from './render';
import paths from '../../config/paths';
import Home from '../shared/home/components/Home';
import Character from '../shared/character/Character';

require('dotenv').config();

const app = express();

// TODO: Use Nginx or Apache to serve static assets in production or remove the if() around the following
// lines to use the express.static middleware to serve assets for production (not recommended!)
if (process.env.NODE_ENV === 'development') {
  app.use(paths.publicPath, express.static(path.join(paths.clientBuild, paths.publicPath)));
  app.use('/favicon.ico', (req, res) => {
    res.send('');
  });
  const manifestPath = path.join(paths.clientBuild, paths.publicPath);

  app.use(
    manifestHelpers({
      manifestPath: `${manifestPath}/manifest.json`,
    })
  );
} else {
  app.use(cors());
}

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.store = configureStore();
  return next();
});

app.use('/characters/:slug', (req, res, next) => {
  const component = Character;
  req.store
    .dispatch(component.serverFetch(req.params.slug))
    .then(() => {
      serverRender(component)(req, res);
    })
    .catch((error) => {
      console.log(error);
      // todo send pretty 404 page.
      res.sendStatus(404);
    });
});

// Keep the home page last.
app.use('/', (req, res, next) => {
  if (req.url !== '/') {
    // @TODO: use 404 page. hacky...
    res.sendStatus(404);
  }
  serverRender(Home)(req, res);
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  return res.status(404).json({
    status: 'error',
    message: err.message,
    stack:
      // print a nicer stack trace by splitting line breaks and making them array items
      process.env.NODE_ENV === 'development' &&
      (err.stack || '')
        .split('\n')
        .map((line) => line.trim())
        .map((line) => line.split(path.sep).join('/'))
        .map((line) =>
          line.replace(
            process
              .cwd()
              .split(path.sep)
              .join('/'),
            '.'
          )
        ),
  });
});

app.listen(process.env.PORT || 8500, () => {
  console.log(
    `[${new Date().toISOString()}]`,
    chalk.blue(`App is running: 🌎 http://localhost:${process.env.PORT || 8500}`)
  );
});

export default app;
