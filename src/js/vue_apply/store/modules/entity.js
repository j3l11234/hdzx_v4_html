import md5 from 'md5';

import * as ServerApi from '../../../common/units/ServerApi';
import * as types from '../mutation-types';

// initial state
const state = {
  rooms: {},
  depts: {},
  orders: {},
  locks: {}
}

// getters
const getters = {
}

// actions
const actions = {
}

// mutations
const mutations = {
  [types.ENTITY_UPDATE_ROOMS] (state, { rooms }) {
    state.rooms = Object.assign({}, state.rooms, rooms);
  },
  [types.ENTITY_UPDATE_DEPTS] (state, { depts }) {
    state.depts = Object.assign({}, state.depts, depts);
  },
  [types.ENTITY_UPDATE_LOCKS] (state, { locks }) {
    state.locks = Object.assign({}, state.locks, locks);
  },
  [types.ENTITY_UPDATE_ORDERS] (state, { orders }) {
    state.orders = Object.assign({}, state.orders, orders);
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
