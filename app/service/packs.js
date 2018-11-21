'use strict';

const Service = require('egg').Service;

const fs = require('fs-extra');
const path = require('path');
const moment = require('moment');

const defaultPrefix = 'rn'; // 'app_driver/';

const iosLogo = 'https://developer.apple.com/design/images/ada-2018-hero-small_2x.png';
const androidLogo = 'https://s1.ax1x.com/2018/11/18/FSdtHS.png';

const getOS = name => {
  const ios = (path.extname(name) === '.apk') ? 'IOS' : '';
  return (path.extname(name) === '.apk') ? 'Android' : ios;
};

const getLogo = name => {
  const os = getOS(name);
  return (os === 'Android') ? androidLogo : ((os === 'IOS') ? iosLogo : '');
};

class PacksService extends Service {
  async list(params) {
    const { id, environment = '' } = params;
    return await this.ossList(id, environment);
  }

  async create(args) {
    const { ctx, app } = this;

    const nsp = app.io.of('/packaging');
    const payload = ctx.helper.parseMsg('updatePacking', true, { location: 'service.packs.create.start' });
    nsp.emit('res', payload);

    const parcel = await ctx.service.parcels.show(args.parcelid);
    const directory = path.join(__dirname, `../../tmp/${parcel.id}`);
    const exists = await fs.pathExists(directory);
    if (exists) {
      return false;
    }
    ctx.coreLogger.info(`创建目录 ${directory}`);
    await fs.ensureDir(directory);
    const configf = path.join(directory, 'config.json');
    ctx.coreLogger.info(`创建锁文件 ${configf}`);
    await fs.outputJson(configf, Object.assign({}, args, parcel));

    ctx.coreLogger.info('执行打包任务');
    ctx.app.runSchedule('packging_task');

    return true;
  }

  async destroy(args) {
    return await this.ctx.oss.delete(args.id);
  }

  async working() {
    const directory = path.join(__dirname, '../../tmp/');
    const exitst = await fs.pathExists(directory);
    return exitst ? fs.readdirSync(directory).length > 0 : true;
  }

  async done(id) {
    const { app } = this;

    const nsp = app.io.of('/packaging');
    const payload = this.ctx.helper.parseMsg('done', { id });
    nsp.emit('res', payload);
  }

  async fail(id) {
    const { app } = this;

    const nsp = app.io.of('/packaging');
    const payload = this.ctx.helper.parseMsg('fail', { id });
    nsp.emit('res', payload);
  }

  packList(start, count) {
    const list = [];
    const packsData = require('../data/packs.json');
    const total = packsData.length;
    if (start >= total) {
      this.ctx.throw(400, 'Bad Request', { detail: { total, offset: start } });
    }
    for (let i = 0; i < count; i += 1) {
      if ((start + i) < total) {
        list.push(packsData[start + i]);
      }
    }

    return list;
  }

  async ossList(parcelid = '', environment = '') {
    const { ctx } = this;

    const mapOSS = result => result.objects
      .filter(o => (path.extname(o.name) === '.ipa') || (path.extname(o.name) === '.apk'))
      .sort((a, b) => moment(b.lastModified) - moment(a.lastModified))
      .map(o => {
        const title = path.basename(o.name);
        const version = title.match(/v[0-9]+.[0-9]+.[0-9]+/)[0];
        const resource = ctx.oss.signatureUrl(o.name);
        return {
          id: o.name,
          title,
          resource,
          updatedAt: new Date(o.lastModified).getTime(),
          createdAt: o.lastModified,
          percent: 100,
          os: getOS(o.name),
          environment: path.basename(path.dirname(o.name)),
          status: 'normal',
          version,
          logo: getLogo(o.name),
        };
      });

    let result = [];
    try {
      result = await ctx.oss.list({
        prefix: `${defaultPrefix}/${parcelid}/${environment}`,
        'max-keys': 1000,
      }).then(mapOSS);
    } catch (error) {
      ctx.coreLogger.error(error);
    }
    return result;
  }
}


module.exports = PacksService;
