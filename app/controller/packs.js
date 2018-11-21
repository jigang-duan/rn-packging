'use strict';

const Controller = require('egg').Controller;

const indexRule = {
  environment: { type: 'string', required: false },
  offset: { type: 'int', required: false, convertType: 'int', min: 0 },
  limit: { type: 'int', required: false, convertType: 'int', min: 1 },
};

const createRule = {
  environment: 'string',
  format: { type: 'enum', values: [ 'ZIP', '未压缩' ] },
  os: { type: 'enum', values: [ 'Android', 'IOS' ] },
  // release: { type: 'enum', values: [ 'immediately', 'specified' ] },
  // upgrade: { type: 'enum', values: [ 'recommended', 'mandatory' ] },
  version: 'string',
};

class PacksController extends Controller {
  async index() {
    const ctx = this.ctx;
    ctx.validate(indexRule, ctx.query);
    const id = ctx.params.parcelid;
    const environment = ctx.query.environment;
    ctx.body = await ctx.service.packs.list({ id, environment });
    ctx.status = 200;
  }

  async create() {
    const ctx = this.ctx;
    const parcelid = ctx.params.parcelid;
    ctx.validate(createRule, ctx.request.body);
    const args = ctx.request.body;

    ctx.body = await ctx.service.packs.create(Object.assign({}, args, { parcelid }));
    ctx.status = 201;
  }

  async destroy() {
    const ctx = this.ctx;
    const parcelid = ctx.params.parcelid;
    const id = ctx.params.id;
    if (parcelid && id) {
      await ctx.service.packs.destroy({ id });
      ctx.body = await ctx.service.packs.list({ id: parcelid });
      ctx.status = 200;
      return;
    }
    ctx.status = 421;
  }
}

module.exports = PacksController;
