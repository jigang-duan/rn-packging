'use strict';

const Controller = require('egg').Controller;

const createRule = {
  id: 'string',
  title: 'string',
  avatar: 'url',
  description: 'string',
  git: {
    type: 'object',
    rule: {
      url: 'string',
      branch: 'string',
    },
  },
};

class ParcelsController extends Controller {
  async index() {
    const ctx = this.ctx;

    ctx.body = await ctx.service.parcels.list();
    ctx.status = 200;
  }

  async show() {
    const ctx = this.ctx;
    const id = ctx.params.id;

    ctx.body = await ctx.service.parcels.show(id);
    ctx.status = 200;
  }

  async create() {
    const ctx = this.ctx;
    ctx.validate(createRule, ctx.request.body);
    const item = ctx.request.body;

    ctx.body = await ctx.service.parcels.update(item);
    ctx.status = 201;
  }
}

module.exports = ParcelsController;
