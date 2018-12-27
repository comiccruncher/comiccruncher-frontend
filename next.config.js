const isProd = process.env.NODE_ENV === 'production';

const CDN = 'https://flash.comiccruncher.com';

const API = 'https://api.comiccruncher.com';

module.exports = {
  resolve: {
    aliasFields: ['browser'],
  },
  useFileSystemPublicRoutes: false,
  poweredByHeader: false,
  assetPrefix: isProd ? CDN : '',
  publicRuntimeConfig: {
    apiURL: API,
    isProd: isProd,
    cdnURL: CDN,
    gaID: 'UA-4951063-15',
    API: {
      baseURL: API,
      statsURL: API + '/stats',
      charactersURL: API + '/characters',
      publishersURL: API + '/publishers',
      trendingURL: API + '/trending',
    },
  },
};
