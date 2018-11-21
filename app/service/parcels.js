'use strict';

const Service = require('egg').Service;

const fs = require('fs-extra');
const path = require('path');

class ParcelsService extends Service {
  async list() {
    return this.fakeParcels();
  }

  async show(id) {
    const parcels = this.fakeParcels().filter(it => it.id === id);
    if (parcels.length === 0) {
      this.ctx.throw(404, 'Not Found', { detail: '找不到资源' });
    }
    return parcels[0];
  }

  async update(it) {
    const parcels = this.fakeParcels();
    const list = [];
    const now = new Date();
    let has = false;
    parcels.forEach(element => {
      if (element.id !== it.id) { list.push(element); } else has = true;
    });
    const at = has ? { updatedAt: now } : { updatedAt: now, createdAt: now };
    const item = Object.assign({}, it, at);
    list.push(item);
    const filePath = path.join(__dirname, '../data/parcels.json');
    await fs.writeJson(filePath, list);
    return list;
  }

  fakeParcels() {
    return require('../data/parcels.json');
  }
}

module.exports = ParcelsService;
