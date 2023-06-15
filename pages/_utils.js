/**
 * All these methods are supposed to work client + server side for NextJS.
 */
import getConfig from 'next/config';
import axios from 'axios';

const { charactersURL, publishersURL, trendingURL } = getConfig().publicRuntimeConfig.API;


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
  const url = charactersURL + "/pages/1"
  return axios
    .get(url)
    .then((characters) => {
      // Hard-code stats for now. Can remove later.
      return {
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

export const requestAPIProps = async(req, res, url) => {
  return axios.get(url).then(resp => resp.data).catch(err => handleError(err))
}

export const getPublisherProps = async(req, res, publisher) => {
  if (typeof sessionStorage !== 'undefined') {
    const val = sessionStorage.getItem(`comiccruncher.${publisher}`);
    if (val === 'trending') {
      return await getTrendingProps(req, res, publisher);
    }
  }
  return requestAPIProps(req, res, `${publishersURL}/${publisher}/pages/1`)
}

export const getMarvelProps = async (req, res, _) => {
  return getPublisherProps(req, res, "marvel")
};
    
export const getDCProps = async (req, res, _) => {
  return getPublisherProps(req, res, "dc")
};

export const getTrendingProps = async (req, res, publisherSlug) => {
  return requestAPIProps(req, res, `${trendingURL}/${publisherSlug}/pages/1`)
};

export const getCharacterProps = async (req, res, query) => {
  // need to check req first, then the query params for client-side
  // fetch. fixed forward-button bug on mobile.
  const slug = req?.query?.slug ?? query.slug;
  return requestAPIProps(req, res, `${charactersURL}/${slug}`)
};
