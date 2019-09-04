const express = require('express');
const next = require('next');
const cookieParser = require('cookie-parser');
const winston = require('winston');
const uuidv4 = require('uuid/v4');

const IS_DEV = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT ? process.env.PORT : 3000;

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
    res.cookie('cc_visitor_id', uuidv4(), secureCookieOpts);
    next();
  } else {
    next();
  }
};

const HTTPSRedirect = (req, res, next) => {
  if (!IS_DEV && !req.secure) {
    res.redirect('https://' + req.hostname + req.originalUrl);
  } else {
    next();
  }
};

const NonWWWRedirect = (req, res, next) => {
  const host = req.header('host');
  if (host.slice(0, 4) === 'www.') {
    return res.redirect(301, req.protocol + '://' + host.slice(4) + req.originalUrl);
  } else {
    next();
  }
};

app
  .prepare()
  .then(() => {
    const server = express();
    // Redirect http to https if not secure since we are using GAE standard plan.
    server.use(HTTPSRedirect);
    // Redirect www to non-www since we are using GAE standard.
    server.use(NonWWWRedirect);
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
      app.render(req, res, '/marvel', req.params);
    });

    server.get('/dc', (req, res) => {
      app.render(req, res, '/dc', req.params);
    });

    server.get('/characters/:slug', (req, res) => {
      app.render(req, res, '/characters', req.params);
    });

    server.get('/faq', (req, res) => {
      app.render(req, res, '/faq', req.params);
    });

    server.get('/', (req, res) => {
      // `/index` is the filename of `/pages/index.js
      // * must pass in req.params for back button to work:
      // https://github.com/zeit/next.js/issues/3065#issuecomment-423035872
      app.render(req, res, '/', req.params);
    });

    server.get('*', (req, res) => {
      return handle(req, res);
    });

    server.listen(PORT, (err) => {
      if (err) {
        throw err;
      }
      const GAE_DEPLOYMENT_ID = process.env.GAE_DEPLOYMENT_ID;
      if (GAE_DEPLOYMENT_ID) {
        const GAE_INSTANCE = process.env.GAE_INSTANCE;
        const GAE_MEMORY_MB = process.env.GAE_MEMORY_MB;
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
