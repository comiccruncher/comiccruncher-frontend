const isProd = process.env.NODE_ENV === 'production';

const CDN = 'https://flash.comiccruncher.com';

const API = 'https://flash.comiccruncher.com/api';

const SITE = isProd ? 'https://comiccruncher.com' : 'http://localhost:3000';

module.exports = {
  resolve: {
    aliasFields: ['browser'],
  },
  useFileSystemPublicRoutes: false,
  poweredByHeader: false,
  assetPrefix: isProd ? CDN : '',
  distDir: 'build',
  publicRuntimeConfig: {
    siteURL: SITE,
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
      searchCharactersURL: API + '/search/characters',
    },
  },
};
