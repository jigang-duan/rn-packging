'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, io } = app;

  router.resources('parcels', '/api/parcels', controller.parcels);
  router.resources('packs', '/api/parcels/:parcelid/packs', controller.packs);
  io.of('/packaging').route('packaging', io.controller.packaging.index);

  router.get('/', controller.home.index);
};
