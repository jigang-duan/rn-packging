import { queryPackList, queryParcel, removePack, addPackList } from '@/services/api';
import { socketConnect } from '@/services/socketio';
import _ from 'lodash';

export default {
  namespace: 'pack',

  state: {
    list: [],
    parent: {},
    packing: false,
    envs: [],
    error: null,
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryPackList, payload.id, payload.params);
      const list = Array.isArray(response) ? response : [];
      yield put({
        type: 'queryList',
        payload: list,
      });
      yield put({
        type: 'changeEnvs',
        payload: list,
      });
    },
    *fetchWithEnvironment({ payload }, { call, put }) {
      const response = yield call(queryPackList, payload.id, payload.params);
      const list = Array.isArray(response) ? response : [];
      yield put({
        type: 'queryList',
        payload: list,
      });
    },
    *fetchParent({ payload }, { call, put }) {
      const response = yield call(queryParcel, payload);
      yield put({
        type: 'queryParent',
        payload: response,
      });
    },
    *appendFetch({ payload }, { call, put }) {
      const response = yield call(queryPackList, payload);
      yield put({
        type: 'appendList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *submit({ payload }, { call, put, select }) {
      if (payload.id) {
        const parentID = yield select(state => state.pack.parent.id);
        const id = encodeURIComponent(payload.id);
        const response = yield call(removePack, parentID, id);
        const list = Array.isArray(response) ? response : [];
        yield put({
          type: 'queryList',
          payload: list,
        });
        yield put({
          type: 'changeEnvs',
          payload: list,
        });
      } else {
        yield call(addPackList, payload);
      }
    },
    *changeEnvs({ payload }, { put }) {
      const envs = _(payload)
        .groupBy(it => it.environment)
        .map((items, env) => ({ env, count: items.length }))
        .value();
      yield put({
        type: 'updateEnvs',
        payload: envs,
      });
    },
    *done({ payload }, { put }) {
      yield put({
        type: 'fetch',
        payload: { id: payload.id },
      });
      yield put({
        type: 'updatePacking',
        payload: false,
      });
    },
    *fail({ payload }, { put }) {
      yield put({
        type: 'reportError',
        payload: { id: payload.id },
      });
      yield put({
        type: 'updatePacking',
        payload: false,
      });
    },
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    queryParent(state, action) {
      return {
        ...state,
        parent: action.payload,
      };
    },
    appendList(state, action) {
      return {
        ...state,
        list: state.list.concat(action.payload),
      };
    },
    updatePacking(state, action) {
      return {
        ...state,
        packing: action.payload,
      };
    },
    updateEnvs(state, action) {
      return {
        ...state,
        envs: action.payload,
      };
    },
    reportError(state, action) {
      return {
        ...state,
        error: action.payload,
      };
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, query }) => {
        if (pathname === '/parcel/list' && query && query.id) {
          dispatch({
            type: 'fetchParent',
            payload: query.id,
          });
          dispatch({
            type: 'fetch',
            payload: {
              id: query.id,
              params: {},
            },
          });
        }
      });
    },
    openSocket({ dispatch }) {
      return socketConnect(msg => {
        const content = {
          type: msg.data.action,
          payload: msg.data.payload,
        };
        dispatch(content);
      });
    },
  },
};
