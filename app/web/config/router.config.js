export default [
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    // authority: ['admin', 'user'],
    routes: [
      { path: '/', redirect: '/parcel/card-list' },
      // my
      {
        path: '/parcel',
        name: 'parcel',
        icon: 'table',
        routes: [
          {
            path: '/parcel/card-list',
            name: 'cardlist',
            component: './Parcel/CardList',
          },
          {
            path: '/parcel/list',
            // name: 'basiclist',
            component: './Parcel/BasicList',
          },
        ],
      },
      {
        // name: 'exception',
        icon: 'warning',
        path: '/exception',
        routes: [
          // exception
          {
            path: '/exception/403',
            name: 'not-permission',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            hideInMenu: true,
            component: './Exception/TriggerException',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
