import React from 'react';
import { Router as DefaultRouter, Route, Switch } from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/_renderRoutes';
import RendererWrapper0 from '/Users/jigang.duan/WorkSpace/jiagn.duan/egg-ant-design-pro/app/web/src/pages/.umi/LocaleWrapper.jsx'

let Router = require('dva/router').routerRedux.ConnectedRouter;

let routes = [
  {
    "path": "/",
    "component": dynamic({ loader: () => import('../../layouts/BasicLayout'), loading: require('/Users/jigang.duan/WorkSpace/jiagn.duan/egg-ant-design-pro/app/web/src/components/PageLoading/index').default }),
    "Routes": [require('../Authorized').default],
    "routes": [
      {
        "path": "/",
        "redirect": "/parcel/card-list",
        "exact": true
      },
      {
        "path": "/parcel",
        "name": "parcel",
        "icon": "table",
        "routes": [
          {
            "path": "/parcel/card-list",
            "name": "cardlist",
            "component": dynamic({ loader: () => import('../Parcel/CardList'), loading: require('/Users/jigang.duan/WorkSpace/jiagn.duan/egg-ant-design-pro/app/web/src/components/PageLoading/index').default }),
            "exact": true
          },
          {
            "path": "/parcel/list",
            "component": dynamic({ loader: () => import('../Parcel/BasicList'), loading: require('/Users/jigang.duan/WorkSpace/jiagn.duan/egg-ant-design-pro/app/web/src/components/PageLoading/index').default }),
            "exact": true
          },
          {
            "component": () => React.createElement(require('/Users/jigang.duan/WorkSpace/jiagn.duan/egg-ant-design-pro/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "icon": "warning",
        "path": "/exception",
        "routes": [
          {
            "path": "/exception/403",
            "name": "not-permission",
            "component": dynamic({ loader: () => import('../Exception/403'), loading: require('/Users/jigang.duan/WorkSpace/jiagn.duan/egg-ant-design-pro/app/web/src/components/PageLoading/index').default }),
            "exact": true
          },
          {
            "path": "/exception/404",
            "name": "not-find",
            "component": dynamic({ loader: () => import('../Exception/404'), loading: require('/Users/jigang.duan/WorkSpace/jiagn.duan/egg-ant-design-pro/app/web/src/components/PageLoading/index').default }),
            "exact": true
          },
          {
            "path": "/exception/500",
            "name": "server-error",
            "component": dynamic({ loader: () => import('../Exception/500'), loading: require('/Users/jigang.duan/WorkSpace/jiagn.duan/egg-ant-design-pro/app/web/src/components/PageLoading/index').default }),
            "exact": true
          },
          {
            "path": "/exception/trigger",
            "name": "trigger",
            "hideInMenu": true,
            "component": dynamic({ loader: () => import('../Exception/TriggerException'), loading: require('/Users/jigang.duan/WorkSpace/jiagn.duan/egg-ant-design-pro/app/web/src/components/PageLoading/index').default }),
            "exact": true
          },
          {
            "component": () => React.createElement(require('/Users/jigang.duan/WorkSpace/jiagn.duan/egg-ant-design-pro/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "component": dynamic({ loader: () => import('../404'), loading: require('/Users/jigang.duan/WorkSpace/jiagn.duan/egg-ant-design-pro/app/web/src/components/PageLoading/index').default }),
        "exact": true
      },
      {
        "component": () => React.createElement(require('/Users/jigang.duan/WorkSpace/jiagn.duan/egg-ant-design-pro/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
      }
    ]
  },
  {
    "component": () => React.createElement(require('/Users/jigang.duan/WorkSpace/jiagn.duan/egg-ant-design-pro/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
  }
];
window.g_plugins.applyForEach('patchRoutes', { initialValue: routes });

export default function() {
  return (
<RendererWrapper0>
          <Router history={window.g_history}>
      { renderRoutes(routes, {}) }
    </Router>
        </RendererWrapper0>
  );
}
