const express = require('express');
const next = require('next');
const dev = process.env.NODE_ENV !== 'production';
const authSecret = process.env.CC_JWT_AUTH_SECRET;
const app = next({ dev });
const handle = app.getRequestHandler();
const cookieParser = require('cookie-parser');
const axios = require('axios');

const getToken = () => {
  try {
    return axios({
      method: 'get',
      url: 'http://localhost:8001/authenticate',
      headers: {
        Authorization: `Bearer ${authSecret}`,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

const jwtMiddleware = async (req, res, next) => {
  if (!req.cookies || !req.cookies.cc_session_id) {
    const data = await getToken();
    // UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). (rejection id: 1)
    //  WHY? I CAUGHT THE ERROR!!!!!!!!
    if (data) {
      const t = data.data.token;
      res.cookie('cc_session_id', t, { httpOnly: !dev, secure: !dev });
    }
  }
};

app
  .prepare()
  .then(() => {
    const server = express();
    server.disable('x-powered-by');
    server.use(cookieParser());
    server.use((req, res, next) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'sameorigin');
      res.setHeader('Referrer-Policy', 'origin');
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
      res.setHeader('x-xss-protection', '1; mode=block');
      jwtMiddleware(req, res, next);
      next();
    });

    server.get('/marvel', (req, res) => {
      // `/marvel` is the filename of `/pages/marvel.js
      // * must pass in req.params for back button to work:
      // https://github.com/zeit/next.js/issues/3065#issuecomment-423035872
      app.render(req, res, '/marvel', req);
    });

    server.get('/dc', (req, res) => {
      app.render(req, res, '/dc', req);
    });

    server.get('/trending', (req, res) => {
      app.render(req, res, '/trending', req);
    });

    server.get('/characters/:slug', (req, res) => {
      app.render(req, res, '/character', req);
    });

    server.get('/faq', (req, res) => {
      app.render(req, res, '/faq', req);
    });

    server.get('/privacy', (req, res) => {
      app.render(req, res, '/privacy', req);
    });

    server.get('/', (req, res) => {
      // `/index` is the filename of `/pages/index.js
      // * must pass in req.params for back button to work:
      // https://github.com/zeit/next.js/issues/3065#issuecomment-423035872
      app.render(req, res, '/index', req);
    });

    server.get('*', (req, res) => {
      return handle(req, res);
    });

    server.listen(3000, (err) => {
      if (err) throw err;
      console.log('> Ready on http://localhost:3000');
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });
