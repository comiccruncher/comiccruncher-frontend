/**
 * All these methods are supposed to work client + server side for NextJS.
 */
import cookies from 'cookie';
import getConfig from 'next/config';
import axios from 'axios';
import rcookies from 'react-cookies';

const { charactersURL, statsURL, publishersURL } = getConfig().publicRuntimeConfig.API;

/**
 * Gets the cc_session_id cookie from the request if set.
 * If not, it reads the cookie from the response of the server.
 * Or reads the browser's client cookies.
 *
 * @param {*} req The client's request
 * @param {*} res The server's response
 * @returns string
 * @throws Error if the cookie isn't found.
 */
const getSessionCookie = (req, res) => {
  // Check for server-side render if the cookies are set in the request.
  if (req && req.cookies && req.cookies.cc_session_id) {
    return encodeURIComponent(req.cookies.cc_session_id);
  }
  // Check for server-side render if no cookie found in request above...
  if (res && res._headers && res._headers['set-cookie']) {
    const setCookies = res._headers['set-cookie'];
    const parsed = setCookies.map((item) => cookies.parse(item)).filter((item) => item.hasOwnProperty('cc_session_id'));
    if (!parsed || parsed.length !== 1) {
      throw new Error('cc_session_id cookie not set');
    }
    return encodeURIComponent(parsed[0].cc_session_id);
  }
  // This would be a client-side request.
  return encodeURIComponent(rcookies.load('cc_session_id'));
};

const getRequestHeaders = (session) => {
  return {
    headers: { Authorization: `Bearer ${session}` },
  };
};

export const getSessionHeaders = (req, res) => {
  let c = null;
  try {
    c = getSessionCookie(req, res);
  } catch (err) {
    logError(err, req, res);
  }
  return getRequestHeaders(c);
};

const logError = (req, res, err, ...msg) => {
  // if not a server render...
  if (!req && !res) {
    return;
  }
  console.info(`REQUEST: path: ${req.path} ip: ${req.ip} method: ${req.method}`);
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
  const opts = getSessionHeaders(req, res);
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
  const opts = getSessionHeaders(req, res);
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
  const opts = getSessionHeaders(req, res);
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
  const opts = getSessionHeaders(req, res);
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
  const opts = getSessionHeaders(req, res);
  return axios
    .get(`${charactersURL}/${encodeURIComponent(req.params.slug)}`, opts)
    .then((result) => {
      return result.data;
    })
    .catch((err) => {
      if (err.response) {
        // Copy response back to server.
        res.statusCode = err.response.status;
      }
      return handleError(req, res, err);
    });
};
