'use strict';

const path = require('path');

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1513765449219_5858';

  config.view = {
    root: path.join(appInfo.baseDir, 'app/view'),
    mapping: {
      '.html': 'nunjucks',
    },
  };

  config.assets = {
    publicPath: '/public',
    devServer: {
      command: 'umi dev',
      port: 8000,
      env: {
        APP_ROOT: path.join(__dirname, '../app/web'),
        BROWSER: 'none',
        SOCKET_SERVER: 'http://127.0.0.1:8000',
      },
      debug: true,
    },
  };

  config.security = {
    csrf: false,
  };

  // add your config here
  config.middleware = [ 'errorHandler' ];

  config.errorHandler = {
    match: '/api',
  };

  // normal oss bucket
  config.oss = {
    client: {
      region: 'oss-cn-hangzhou',
      accessKeyId: 'LTAIBE1d3aXZKibj',
      accessKeySecret: 'boBqJWciffmgdX5NVA1gf8GynE91ij',
      bucket: 'cs2025',
    },
  };

  config.io = {
    namespace: {
      '/packaging': {
        connectionMiddleware: [],
        packetMiddleware: [],
      },
    },
  };

  config.logview = {
  };

  return config;
};
