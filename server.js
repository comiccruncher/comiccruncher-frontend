const express = require('express');
const next = require('next');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const winston = require('winston');
const jwtDecode = require('jwt-decode');

const IS_DEV = process.env.NODE_ENV !== 'production';
const CC_JWT_AUTH_SECRET = process.env.CC_JWT_AUTH_SECRET;

const secureCookieOpts = {
  httpOnly: !IS_DEV,
  secure: !IS_DEV,
  sameSite: 'strict',
};

const app = next({ dev: IS_DEV });

const apiURL = app.nextConfig.publicRuntimeConfig.apiURL;
const handle = app.getRequestHandler();
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.json(), winston.format.timestamp(), winston.format.align()),
  defaultMeta: { service: 'node' },
  transports: [new winston.transports.Console()],
});

const getToken = async () => {
  return await axios
    .post(`${apiURL}/authenticate`, null, {
      headers: {
        Authorization: `Bearer ${CC_JWT_AUTH_SECRET}`,
      },
    })
    .then((resp) => {
      return resp.data.data.token;
    })
    .catch((error) => {
      logger.error(error.toString());
      return null;
    });
};

app
  .prepare()
  .then(() => {
    const server = express();

    server.disable('x-powered-by');

    server.use(cookieParser());

    server.use((req, res, next) => {
      if (!req.cookies.cc_session_id) {
        getToken()
          .then((token) => {
            const result = jwtDecode(token);
            res.cookie('cc_session_id', token, secureCookieOpts);
            res.cookie('cc_visitor_id', result.jti, secureCookieOpts);
            next();
          })
          .catch((err) => {
            logger.error(err);
            next();
          });
      } else {
        next();
      }
    });

    server.use((req, res, next) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'sameorigin');
      res.setHeader('Referrer-Policy', 'origin');
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
      res.setHeader('x-xss-protection', '1; mode=block');
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

    server.get('/trending', (req, res) => {
      app.render(req, res, '/trending', req.params);
    });

    server.get('/characters/:slug', (req, res) => {
      app.render(req, res, '/character', req.params);
    });

    server.get('/faq', (req, res) => {
      app.render(req, res, '/faq', req.params);
    });

    server.get('/privacy', (req, res) => {
      app.render(req, res, '/privacy', req.params);
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

    server.listen(3000, (err) => {
      if (err) throw err;
      logger.info('> Ready on http://localhost:3000');
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });
