import md5 from 'md5';

import * as ServerApi from '../../../common/units/ServerApi';
import { echoAjax } from '../../../common/units/Helpers';
import * as types from '../mutation-types';

// initial state
const state = {
  detail: {
    date: null,
    room_id: null,
    captchaUrl: null,
    status: null,
    roomList: [],
    deptMap: {},
  },
  
}

// getters
const getters = {
}

// actions
const actions = {
  getRoomTables({ dispatch, commit, state }, { start_date, end_date, per_page }) {
    return ServerApi.Order.getRoomTables(start_date, end_date).then(data => {
      let { roomList, dateList, roomTables, serverTime } = data;
      commit(types.UPDATE_SERVERTIME, { serverTime });
      commit(types.ROOMTABLE_UPDATE_ROOMTABLES, { roomTables, now: serverTime });
      commit(types.ROOMTABLE_UPDATE_META, { roomList, dateList });

      commit(types.ROOMTABLE_UPDATE_PAGE, { total: roomList.length, per_page });
      return data;
    });
  },
  apply_chooseDateRoom ({ dispatch, commit, state }, { date, room_id }) {
    if (!date || !room_id || (state.detail.date == date && state.detail.room_id == room_id)) {
      return;
    }
    commit(types.APPLY_UPDATE_DATEROOM, { date, room_id });
    return dispatch('apply_getOneRoomTable',{date, room_id});
  },
  apply_getOneRoomTable({ dispatch, commit }, {date, room_id}) {
    return echoAjax(ServerApi.Order.getRoomUse(date, room_id)).then(data => {
      let { orders, locks, roomTable, serverTime } = data;
      commit(types.UPDATE_SERVERTIME, { serverTime });
      commit(types.ENTITY_UPDATE_ORDERS, { orders });
      commit(types.ENTITY_UPDATE_LOCKS, { locks });
      commit(types.ROOMTABLE_UPDATE_ROOMTABLES, {roomTables: {[date+'_'+room_id]: roomTable}, now: serverTime });
      return data;
    });
  },
  apply_page({ dispatch, commit, state, }, { page } ) {
    commit(types.ROOMTABLE_UPDATE_PAGE, {cur_page: page});
  },
  apply_updateCaptcha({ commit }, ) {
    return ServerApi.Order.getCaptcha().then(data => {
      commit(types.APPLY_UPDATE_CAPTCHA, data);
    });
  },
  apply_submit({ dispatch, commit, state, }, {data}) {
    let {date, room_id} = data;
    return echoAjax(ServerApi.Order.submitOrder(data)).then(data => {
      dispatch('apply_getOneRoomTable', {date, room_id});
      console.log(data);
      return data;
    });
  }
}

// mutations
const mutations = {
  [types.APPLY_UPDATE_META] (state, { roomList, deptMap }) {
      state.detail.roomList = roomList;
      state.detail.deptMap = deptMap;
  },
  [types.APPLY_UPDATE_DATEROOM] (state, { date, room_id }) {
    state.detail.date = date;
    state.detail.room_id = room_id;
    // state.dateList = dateList;
    // state.roomList = roomList;
    //console.log(state);
  },
  [types.APPLY_UPDATE_CAPTCHA] (state, { url }) {
    state.detail.captchaUrl = url;
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
