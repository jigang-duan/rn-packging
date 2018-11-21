import dva from 'dva';
import createLoading from 'dva-loading';

const runtimeDva = window.g_plugins.mergeConfig('dva');
let app = dva({
  history: window.g_history,
  
  ...(runtimeDva.config || {}),
});

window.g_app = app;
app.use(createLoading());
(runtimeDva.plugins || []).forEach(plugin => {
  app.use(plugin);
});

app.model({ namespace: 'global', ...(require('/Users/jigang.duan/WorkSpace/jiagn.duan/egg-ant-design-pro/app/web/src/models/global.js').default) });
app.model({ namespace: 'setting', ...(require('/Users/jigang.duan/WorkSpace/jiagn.duan/egg-ant-design-pro/app/web/src/models/setting.js').default) });
app.model({ namespace: 'pack', ...(require('/Users/jigang.duan/WorkSpace/jiagn.duan/egg-ant-design-pro/app/web/src/pages/Parcel/models/pack.js').default) });
app.model({ namespace: 'parcel', ...(require('/Users/jigang.duan/WorkSpace/jiagn.duan/egg-ant-design-pro/app/web/src/pages/Parcel/models/parcel.js').default) });
app.model({ namespace: 'error', ...(require('/Users/jigang.duan/WorkSpace/jiagn.duan/egg-ant-design-pro/app/web/src/pages/Exception/models/error.js').default) });
