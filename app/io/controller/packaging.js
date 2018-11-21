'use strict';

const Controller = require('egg').Controller;

class PackagingController extends Controller {
  async index() {
    const { ctx } = this;
    const res = await ctx.service.packs.working();
    const payload = ctx.helper.parseMsg('updatePacking', res);
    ctx.socket.emit('res', payload);
  }
}

module.exports = PackagingController;
