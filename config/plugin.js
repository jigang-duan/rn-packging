'use strict';

exports.assets = {
  enable: true,
  package: 'egg-view-assets',
};

exports.nunjucks = {
  enable: true,
  package: 'egg-view-nunjucks',
};

exports.validate = {
  enable: true,
  package: 'egg-validate',
};

exports.logview = {
  package: 'egg-logview',
  // env: ['local', 'default', 'test', 'unittest']
};

exports.oss = {
  enable: true,
  package: 'egg-oss',
};

exports.io = {
  enable: true,
  package: 'egg-socket.io',
};
