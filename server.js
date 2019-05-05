const express = require('express');
const next = require('next');
const cookieParser = require('cookie-parser');
const winston = require('winston');
const uuidv4 = require('uuid/v4');
const Firestore = require('@google-cloud/firestore');
const slugify = require('slugify');

const IS_DEV = process.env.NODE_ENV !== 'production';
const DEV_USE_CACHE = process.env.CC_DEV_USE_CACHE || false;
const USE_CACHE = !IS_DEV || DEV_USE_CACHE;
const PORT = process.env.PORT ? process.env.PORT : 3000;

const firestore = new Firestore();
const app = next({ dev: IS_DEV });
const handle = app.getRequestHandler();
const logger = winston.createLogger({
  level: 'info',
  defaultMeta: { service: 'node' },
  transports: new winston.transports.Console({
    format: winston.format.combine(winston.format.timestamp(), winston.format.json(), winston.format.align()),
  }),
});

const secureCookieOpts = {
  secure: !IS_DEV,
  sameSite: 'strict',
};

const UUIDMiddleware = (req, res, next) => {
  if (!req.cookies.cc_visitor_id) {
    //res.cookie('cc_session_id', token, secureCookieOpts);
    res.cookie('cc_visitor_id', uuidv4(), secureCookieOpts);
    next();
  } else {
    next();
  }
};

app
  .prepare()
  .then(() => {
    const server = express();

    server.use(cookieParser());
    server.disable('x-powered-by');
    server.use(UUIDMiddleware);
    server.set('trust proxy', true);

    server.use((req, res, next) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'sameorigin');
      res.setHeader('Referrer-Policy', 'origin');
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
      res.setHeader('x-xss-protection', '1; mode=block');
      if (!IS_DEV) {
        res.setHeader('Access-Control-Allow-Origin', 'https://comiccruncher.com');
        res.setHeader('Vary', 'Origin');
      }
      next();
    });

    server.get('/marvel', (req, res) => {
      // `/marvel` is the filename of `/pages/marvel.js
      // * must pass in req.params for back button to work:
      // https://github.com/zeit/next.js/issues/3065#issuecomment-423035872
      USE_CACHE ? renderAndCache(req, res, '/marvel', req.params) : app.render(req, res, '/marvel', req.params);
    });

    server.get('/dc', (req, res) => {
      USE_CACHE ? renderAndCache(req, res, '/dc', req.params) : app.render(req, res, '/dc', req.params);
    });

    server.get('/characters/:slug', (req, res) => {
      USE_CACHE ? renderAndCache(req, res, '/characters', req.params) : app.render(req, res, '/characters', req.params);
    });

    server.get('/faq', (req, res) => {
      USE_CACHE ? renderAndCache(req, res, '/faq', req.params) : app.render(req, res, '/faq', req.params);
    });

    server.get('/', (req, res) => {
      // `/index` is the filename of `/pages/index.js
      // * must pass in req.params for back button to work:
      // https://github.com/zeit/next.js/issues/3065#issuecomment-423035872
      USE_CACHE ? renderAndCache(req, res, '/', req.params) : app.render(req, res, '/', req.params);
    });

    server.get('*', (req, res) => {
      return handle(req, res);
    });

    server.listen(PORT, (err) => {
      const GAE_DEPLOYMENT_ID = process.env.GAE_DEPLOYMENT_ID;
      const GAE_INSTANCE = process.env.GAE_INSTANCE;
      const GAE_MEMORY_MB = process.env.GAE_MEMORY_MB;
      if (err) throw err;
      if (GAE_DEPLOYMENT_ID) {
        logger.info(
          `started application for ` +
            `GAE_DEPLOYMENT_ID: ${GAE_DEPLOYMENT_ID}, GAE_INSTANCE: ${GAE_INSTANCE}, GAE_MEMORY_MB: ${GAE_MEMORY_MB}`
        );
      }
      logger.info(`> Ready on http://localhost:${PORT}`);
    });
  })
  .catch((ex) => {
    logger.error(ex.stack);
    process.exit(1);
  });

const getCacheKey = (req) => {
  // use path, so cache query strings, too.
  return `frontend/${req.path === '/' ? 'home' : slugify(req.path)}`;
};

const renderAndCache = async (req, res, pagePath, queryParams) => {
  const key = getCacheKey(req);
  const doc = firestore.doc(key);
  doc
    .get()
    .then((snapshot) => {
      if (snapshot.exists) {
        res.setHeader('X-CACHE', 'HIT');
        res.send(snapshot.data().value);
      } else {
        cacheAndSend(key, req, res, pagePath, queryParams, doc);
      }
    })
    .catch((err) => {
      logger.error(err);
      app.renderError(err, req, res, pagePath, queryParams);
    });
};

const cacheAndSend = async (key, req, res, pagePath, query, doc) => {
  try {
    // Render the page into HTML
    const html = await app.renderToHTML(req, res, pagePath, query);
    // Skip the cache
    if (res.statusCode !== 200 && res.statusCode !== 304) {
      res.send(html);
      return;
    }
    // Cache this page
    doc.set({
      value: html,
    });
    res.setHeader('X-CACHE', 'MISS');
    res.status(200);
    res.send(html);
  } catch (err) {
    logger.error(err);
    app.renderError(err, req, res, pagePath, query);
  }
};
