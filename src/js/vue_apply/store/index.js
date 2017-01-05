import Vue from 'vue'
import Vuex from 'vuex'

import * as ServerApi from '../../common/units/ServerApi';
import * as types from './mutation-types'

import roomTable from './modules/roomtable';
import entity from './modules/entity';
import apply from './modules/apply';

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const state = {
  timeOffset: 0,
}

const actions = {
  getMetaData({ commit }, { page }) {
    return ServerApi.Data.getData(page, '').then(data => {
      let { room, dept, tooltip } = data;
      room && commit(types.ENTITY_UPDATE_ROOMS, { rooms: room.rooms });
      dept && commit(types.ENTITY_UPDATE_DEPTS, { depts: dept.depts });
      commit(types.APPLY_UPDATE_META, { roomList: room.roomList, deptMap: dept.deptMap });
      return data;
    });
  }
}

const getters = {
}

// mutations
const mutations = {
  [types.UPDATE_SERVERTIME] (state, { serverTime }) {
    let timeOffset = serverTime*1000 - new Date().getTime();
    state.timeOffset = timeOffset;
  }
}


export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  modules: {
    entity,
    roomTable,
    apply
  },
  strict: debug,
})
