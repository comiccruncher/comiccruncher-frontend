const express = require('express');
const next = require('next');
const cookieParser = require('cookie-parser');
const winston = require('winston');
const redis = require('redis');
const session = require('express-session');
const uuidv4 = require('uuid/v4');
const RedisStore = require('connect-redis')(session);

const IS_DEV = process.env.NODE_ENV !== 'production';
const DEV_USE_CACHE = process.env.CC_DEV_USE_CACHE || false;
const CC_JWT_AUTH_SECRET = process.env.CC_JWT_AUTH_SECRET || 'test';
const CC_REDIS_HOST = process.env.CC_REDIS_HOST || 'localhost';
const CC_REDIS_PORT = process.env.CC_REDIS_PORT || 6379;
const CC_REDIS_PASSWORD = process.env.CC_REDIS_PASSWORD || '';
const USE_CACHE = !IS_DEV || DEV_USE_CACHE;

const redisClient = USE_CACHE
  ? new redis.createClient({
      host: CC_REDIS_HOST,
      port: CC_REDIS_PORT,
      password: CC_REDIS_PASSWORD,
      retry_strategy: (opts) => {
        logger.error(opts);
        if (opts.error && opts.error.code === 'ECONNREFUSED') {
          throw new Error('The redis server refused the connection');
        }
        if (opts.total_retry_time > 3000) {
          // End reconnecting after a specific timeout.
          throw new Error('Retry time exhausted');
        }
        if (opts.attempt > 3) {
          // Attempts exhausted.
          throw new Error(`attempts to connect to ${CC_REDIS_HOST}:${CC_REDIS_PORT} greater than 3. Quit.`);
        }
        return Math.min(opts.attempt * 100, 3000);
      },
    })
  : null;

if (USE_CACHE) {
  redisClient.on('error', (err) => {
    logger.error(err.toString());
  });
}

const app = next({ dev: IS_DEV });
const handle = app.getRequestHandler();
const logger = winston.createLogger({
  level: 'info',
  defaultMeta: { service: 'node' },
  transports: new winston.transports.Console({
    format: winston.format.combine(winston.format.timestamp(), winston.format.json(), winston.format.align()),
  }),
});

/*
const apiURL = app.nextConfig.publicRuntimeConfig.apiURL;
const secureCookieOpts = {
  secure: !IS_DEV,
  sameSite: 'strict',
};
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
    .catch((err) => {
      logger.error(err.toString());
      return 0;
    });
};

const AuthMiddleware = (req, res, next) => {
  if (!req.cookies.cc_visitor_id) {
    getToken()
      .then((token) => {
        const result = jwtDecode(token);
        //res.cookie('cc_session_id', token, secureCookieOpts);
        res.cookie('cc_visitor_id', result.jti, secureCookieOpts);
      })
      .finally(() => {
        next();
      });
  } else {
    next();
  }
};
*/

app
  .prepare()
  .then(() => {
    const server = express();

    server.disable('x-powered-by');

    server.use(
      session({
        secret: CC_JWT_AUTH_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: !IS_DEV, domain: !IS_DEV ? 'https://comiccruncher.com' : '', httpOnly: false },
        genid: () => {
          return uuidv4();
        },
        proxy: !IS_DEV,
        name: 'cc_visitor_id',
        store: new RedisStore({
          host: CC_REDIS_HOST,
          port: CC_REDIS_PORT,
          pass: CC_REDIS_PASSWORD,
          disableTTL: true,
          logErrors: true,
          prefix: 'token:',
        }),
      })
    );

    server.use(cookieParser());

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

    server.listen(3000, (err) => {
      if (err) throw err;
      logger.info('> Ready on http://localhost:3000');
    });
  })
  .catch((ex) => {
    logger.error(ex.stack);
    process.exit(1);
  });

const getCacheKey = (req) => {
  return `frontend:${req.url}`;
};

const renderAndCache = async (req, res, pagePath, queryParams) => {
  const key = getCacheKey(req);

  redisClient.get(key, async (err, data) => {
    if (err) {
      return handleRedisError(req, res, pagePath, queryParams, err);
    }
    if (data === null) {
      cacheAndSend(key, req, res, pagePath, queryParams);
    } else {
      res.setHeader('X-CACHE', 'HIT');
      res.send(data);
    }
  });
};

const handleRedisError = (req, res, pagePath, query, err) => {
  logger.error(err);
  res.setHeader('X-CACHE', 'MISS');
  app.render(req, res, pagePath, query);
};

const cacheAndSend = async (key, req, res, pagePath, query) => {
  try {
    // Render the page into HTML
    const html = await app.renderToHTML(req, res, pagePath, query);
    // Skip the cache
    if (res.statusCode !== 200 && res.statusCode !== 304) {
      res.send(html);
      return;
    }
    // Cache this page
    redisClient.set(key, html);
    res.setHeader('X-CACHE', 'MISS');
    res.status(200);
    res.send(html);
  } catch (err) {
    logger.error(err);
    app.renderError(err, req, res, pagePath, queryParams);
  }
};
