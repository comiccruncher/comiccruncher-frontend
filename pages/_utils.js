/**
 * All these methods are supposed to work client + server side for NextJS.
 */
import getConfig from 'next/config';
import axios from 'axios';
import Cookies from 'universal-cookie';
import cookieParser from 'cookie';

const { charactersURL, statsURL, publishersURL } = getConfig().publicRuntimeConfig.API;

const visitorFilt = (item) => item.hasOwnProperty('cc_visitor_id');
const sessionFilt = (item) => item.hasOwnProperty('cc_session_id');

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
    const session = parsed.filter(sessionFilt);
    const visitor = parsed.filter(visitorFilt);
    return getRequestHeaders(
      session ? session[0].cc_session_id : 'UNDEFINED',
      visitor ? visitor[0].cc_visitor_id : 'UNDEFINED'
    );
  }
  // This would be a client-side request.
  const cookie = new Cookies();
  return getCookieHeaders(cookie);
};

const getRequestHeaders = (cc_session_id, cc_visitor_id) => {
  return {
    headers: {
      Authorization: `Bearer ${cc_session_id}`,
      'X-VISITOR-ID': cc_visitor_id,
    },
    params: {
      key: 'batmansmellsbadly',
    },
  };
};

export const getCookieHeaders = (cookie) => {
  return getRequestHeaders(cookie.get('cc_session_id'), cookie.get('cc_visitor_id'));
};

const logError = (req, res, err, ...msg) => {
  // if not a server render...
  if (!req && !res) {
    return;
  }
  console.info(`REQUEST: path: ${req.path} method: ${req.method}`);
  if (!err) {
    return;
  }
  if (err.response) {
    // Response coming from remote request.
    console.error(
      `ERROR: message: ${err.toString()} status code: ${err.response.status} error: ${JSON.stringify(
        err.response.data
      )}`
    );
    return;
  }
  // No response back.. something else.
  console.error(`ERROR: ${err.toString()}`);
  if (msg.length > 0) {
    console.info(`additional info: ${msg}`);
  }
};

const handleError = (req, res, err) => {
  logError(req, res, err);
  if (err && err.response) {
    if (err.response.status === 404) {
      // Send 404 request back to server.
      res.statusCode = 404;
    }
    return err.response.data;
  }
  return { meta: { status_code: 502, error: 'No response received from remote server.' } };
};

export const getHomeProps = (req, res) => {
  const opts = isomorphicGetHeaders(req, res);
  return Promise.all([axios.get(statsURL, opts), axios.get(charactersURL, opts)])
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
      return handleError(err);
    });
};

export const getMarvelProps = (req, res) => {
  const opts = isomorphicGetHeaders(req, res);
  return axios
    .get(`${publishersURL}/marvel`, opts)
    .then((result) => {
      return result.data;
    })
    .catch((err) => {
      return handleError(req, res, err);
    });
};

export const getDCProps = (req, res) => {
  const opts = isomorphicGetHeaders(req, res);
  return axios
    .get(`${publishersURL}/dc`, opts)
    .then((result) => {
      return result.data;
    })
    .catch((err) => {
      return handleError(req, res, err);
    });
};

export const getTrendingProps = (req, res) => {
  const opts = isomorphicGetHeaders(req, res);
  return axios
    .get(`${publishersURL}/dc`, opts)
    .then((result) => {
      return result.data;
    })
    .catch((err) => {
      return handleError(req, res, err);
    });
};

export const getCharacterProps = (req, res) => {
  const opts = isomorphicGetHeaders(req, res);
  return axios
    .get(`${charactersURL}/${encodeURIComponent(req.params.slug)}`, opts)
    .then((result) => {
      return result.data;
    })
    .catch((err) => {
      if (err.response) {
        // Copy response back to server.
        res.statusCode = err.response.status;
      } else {
        // this is really bad..no server response at all.
        res.statusCode = 500;
      }
      return handleError(req, res, err);
    });
};
