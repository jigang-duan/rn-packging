# React Native项目打包管理

Egg + Ant Design Pro

## Development

Egg通过[eggview -assets]与Assets工具集成，所以您不必为服务资产启动另一个命令。

```bash
$ yarn run dev
```

`yarn run dev`将为在`config.assets.devServer`中配置的资产启动一个dev服务器

## Deployment

Assets应该在发货前进行编译。

```bash
$ yarn run build
```

It will be generated to `app/public` that hosted by Egg, due to the configration of `.webpackrc`.

Start Egg with prod environment.

```bash
$ yarn start
```

## License

[MIT](LICENSE)
