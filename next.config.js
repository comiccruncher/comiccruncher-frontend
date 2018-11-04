const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  useFileSystemPublicRoutes: false,
  poweredByHeader: false,
  assetPrefix: isProd ? 'https://flash.comiccruncher.com' : '',
};
