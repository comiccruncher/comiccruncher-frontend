/**
 * All these methods are supposed to work client + server side for NextJS.
 */
import getConfig from 'next/config';
import axios from 'axios';
import Cookies from 'universal-cookie';
import cookieParser from 'cookie';

const { charactersURL, statsURL, publishersURL, trendingURL } = getConfig().publicRuntimeConfig.API;

const visitorFilt = (item) => item.hasOwnProperty('cc_visitor_id');
// const sessionFilt = (item) => item.hasOwnProperty('cc_session_id');

/**
 * Gets the cc_session_id cookie from the request if set.
 * If not, it reads the cookie from the response of the server.
 * Or reads the browser's client cookies.
 *
 * @param {*} req The client's request
 * @param {*} res The server's response
 * @returns string
 */
const isomorphicGetHeaders = (req, res) => {
  // Check for server-side render if the cookies are set in the request.
  if (req && req.headers && req.headers.cookie) {
    const cookie = new Cookies(req.headers.cookie);
    return getCookieHeaders(cookie);
  }
  // Check for server-side render if no cookie found in request above...
  if (res && res._headers && res._headers['set-cookie']) {
    const parsed = res._headers['set-cookie'].map((item) => cookieParser.parse(item));
    // const session = parsed.filter(sessionFilt);
    // session ? session[0].cc_session_id : 'UNDEFINED',
    const visitor = parsed.filter(visitorFilt);
    return getRequestHeaders(visitor ? visitor[0].cc_visitor_id : 0);
  }
  // This would be a client-side request.
  const cookie = new Cookies();
  return getCookieHeaders(cookie);
};

const getRequestHeaders = (cc_visitor_id) => {
  const opts = {
    headers: {
      'X-VISITOR-ID': cc_visitor_id || 0,
    },
  };
  return opts;
};

export const getCookieHeaders = (cookie) => {
  return getRequestHeaders(cookie.get('cc_visitor_id'));
};

const logError = (req, res, err) => {
  // if not a server render... must use || and not && to fix bug
  // for some browsers when using back button ¯\_(ツ)_/¯
  if (!req || !res) {
    return;
  }
  if (!err) {
    return;
  }
  // this block would be server-rendered below.
  const winston = require('winston');
  const logger = winston.createLogger({
    level: 'info',
    defaultMeta: { service: 'node' },
    transports: new winston.transports.Console({
      format: winston.format.combine(winston.format.timestamp(), winston.format.json(), winston.format.align()),
    }),
  });
  if (err.response) {
    // Response coming from remote request.
    logger.error({ message: err.toString(), path: req.path, meta: err.response.data.meta || '' });
    return;
  }
  // No response back.. something else.
  logger.error({ message: err.toString(), path: req.path });
};

const handleError = (req, res, err) => {
  logError(req, res, err);
  if (err && err.response) {
    if (res) {
      res.status(err.response.status);
    }
    return err.response.data;
  }
  if (res) {
    res.status(502);
  }
  return { meta: { status_code: 502, error: 'No response received from remote server.' } };
};

export const getHomeProps = async (req, res) => {
  const opts = isomorphicGetHeaders(req, res);
  return axios
    .all([axios.get(statsURL, opts), axios.get(charactersURL, opts)])
    .then(([stats, characters]) => {
      return {
        stats: stats.data,
        characters: characters.data,
        meta: {
          status_code: 200,
          error: '',
        },
      };
    })
    .catch((err) => {
      return handleError(req, res, err);
    });
};

export const getMarvelProps = async (req, res) => {
  if (typeof sessionStorage !== 'undefined') {
    const val = sessionStorage.getItem('comiccruncher.marvel');
    if (val === 'trending') {
      return await getTrendingProps(req, res, 'marvel');
    }
  }
  const opts = isomorphicGetHeaders(req, res);
  return await axios
    .get(`${publishersURL}/marvel`, opts)
    .then((result) => {
      return result.data;
    })
    .catch((err) => {
      return handleError(req, res, err);
    });
};

export const getDCProps = async (req, res, query) => {
  if (typeof sessionStorage !== 'undefined') {
    const val = sessionStorage.getItem('comiccruncher.dc');
    if (val === 'trending') {
      return await getTrendingProps(req, res, 'dc');
    }
  }
  const opts = isomorphicGetHeaders(req, res);
  return await axios
    .get(`${publishersURL}/dc`, opts)
    .then((result) => {
      return result.data;
    })
    .catch((err) => {
      return handleError(req, res, err);
    });
};

export const getTrendingProps = async (req, res, publisherSlug) => {
  const opts = isomorphicGetHeaders(req, res);
  return await axios
    .get(`${trendingURL}/${encodeURIComponent(publisherSlug)}`, opts)
    .then((result) => {
      return result.data;
    })
    .catch((err) => {
      return handleError(req, res, err);
    });
};

export const getCharacterProps = async (req, res, query) => {
  const opts = isomorphicGetHeaders(req, res);
  // need to check req first, then the query params for client-side
  // fetch. fixed forward-button bug on mobile.
  let slug = null;
  if (req && req.params.slug) {
    slug = req.params.slug;
  } else {
    slug = query.slug;
  }
  return await axios
    .get(`${charactersURL}/${encodeURIComponent(slug)}`, opts)
    .then((result) => {
      return result.data;
    })
    .catch((err) => {
      return handleError(req, res, err);
    });
};
