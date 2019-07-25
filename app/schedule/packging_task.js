'use strict';

const Subscription = require('egg').Subscription;

const fs = require('fs-extra');
const path = require('path');
const shell = require('shelljs');

// const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

class PackgingTask extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      interval: '500m', // 1 分钟间隔
      type: 'worker', // 指定所有的 worker 都需要执行
      disable: true,
      immediate: true,
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    this.ctx.coreLogger.info(`---------开始任务-${process.version}-------------`);
    const tmpPath = path.join(__dirname, '../../tmp');
    const pros = shell.ls(tmpPath).map(p => path.join(tmpPath, p));
    if (pros.length === 1) {
      await this.buildPro(pros[0]);
    }
    this.ctx.coreLogger.info('---------结束任务--------------');
  }

  async buildPro(proPath) {
    const configPath = path.join(proPath, 'config.json');
    const exists = await fs.pathExists(configPath);
    if (!exists) {
      return;
    }
    const configObj = await fs.readJson(configPath);
    if (configObj && configObj.git && configObj.git.url && configObj.git.branch) {
      if (!shell.which('git')) {
        this.ctx.coreLogger.error('抱歉，需要git');
        return;
      }
      const current = path.join(proPath, 'current');
      const command = `git clone ${configObj.git.url} ${current} -b ${configObj.git.branch} --depth=1`;
      this.ctx.coreLogger.info(command);
      if (shell.exec(command).code !== 0) {
        this.ctx.coreLogger.error('Error: Git clone failed');
        return;
      }
      const buildscript = path.join(current, '.buildsh/index.sh');
      const canBuild = await fs.pathExists(buildscript);
      if (!canBuild) {
        return;
      }

      const version = `-v ${configObj.version}`;
      const need_android = configObj.os === 'Android' ? '-a' : '';
      const need_ios = configObj.os === 'IOS' ? '-i' : '';
      shell.pushd(current);
      const cmdline = `bash -x ${buildscript} ${need_android} ${need_ios} ${version} -e ${configObj.environment}`;
      this.ctx.coreLogger.info(`执行脚本的当前目录${process.cwd()}`);
      this.ctx.coreLogger.info(cmdline);
      const rv = shell.exec(cmdline);
      shell.popd();
      if (rv.code !== 0) {
        this.ctx.coreLogger.error(rv.stderr);
        await fs.remove(proPath);
        this.service.packs.fail(configObj.id);
        return;
      }
      this.ctx.coreLogger.info(rv.stdout);
      const appPath = path.join(current, '.buildsh/app');
      const apps = shell.ls(appPath).map(p => path.join(appPath, p));
      if (apps.length === 1) {
        const now = (new Date()).toLocaleString();
        const ext = path.extname(apps[0]);
        const tarapp = `${configObj.id}-v${configObj.version}-${now}${ext}`;
        const tarPath = path.join(proPath, tarapp);
        await fs.copy(apps[0], tarPath);
        const result = await this.uploadPackage(
          `rn/${configObj.id}/${configObj.environment}/${tarapp}`,
          tarPath);
        this.ctx.coreLogger.info(result);
      }
      await fs.remove(proPath);
      this.service.packs.done(configObj.id);
    }
  }

  async uploadPackage(location, packagePath) {
    return await this.ctx.oss.put(location, packagePath);
  }
}

module.exports = PackgingTask;
