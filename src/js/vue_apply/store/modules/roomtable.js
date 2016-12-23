import md5 from 'md5';

import * as ServerApi from '../../../common/units/ServerApi';
import * as types from '../mutation-types';

// initial state
const state = {
  dateList: [],
  roomList: [],
  roomTables: {},
  page: {
    cur_page: 1,
    per_page: 8,
    total_page: 0,
    total: 0
  },
  expired: -1
}

// getters
const getters = {
}

// actions
const actions = {
  roomtable_refreshTime({ dispatch, commit, state,rootState }) {
    let now = Math.floor((new Date().getTime() + rootState.timeOffset) / 1000);
    if (state.expired != -1 && now >= state.expired){
      commit(types.ROOMTABLE_UPDATE_ROOMTABLES,{roomTables:{}, now:now});
    }
  }
}
// mutations
const mutations = {
  [types.ROOMTABLE_UPDATE_META] (state, { roomList, dateList }) {
    state.dateList = dateList;
    state.roomList = roomList;
    //console.log(state);
  },
  [types.ROOMTABLE_UPDATE_PAGE] (state, page) {
    if(page.cur_page) {
      state.page.cur_page = page.cur_page;
    }
    if(page.per_page && parseInt(page.per_page) == page.per_page) {
      state.page.per_page = page.per_page;
    }
    if(page.total) {
      state.page.total = page.total;
    }
    state.page.total_page = Math.ceil(state.page.total/state.page.per_page);
  },
  [types.ROOMTABLE_UPDATE_ROOMTABLES] (state, { roomTables, now }) {
    let expired = now + 600;
    //更新新加入的roomTables
    for (var dateRoom in roomTables) {
      let roomTable = roomTables[dateRoom];
      let status;
      if (now >= roomTable.period.start && now < roomTable.period.end) {
        status = 'ACTIVE';
        expired = Math.min(expired, roomTable.period.end);
      } else if (now < roomTable.period.start) {
        status = 'UPCOMING';
        expired = Math.min(expired, roomTable.period.start);
      } else if(now >= roomTable.period.end) {
        status = 'MISSED';
      }
      roomTable.status = status;
      roomTable.chksum = md5(JSON.stringify(roomTable)).substr(0,6);

      if (state.roomTables[dateRoom] && state.roomTables[dateRoom].chksum == roomTable.chksum){
        continue;
      }
    }
    state.roomTables = Object.assign({}, state.roomTables, roomTables)

    //更新原有的roomTables
    for (var dateRoom in state.roomTables) {
      let roomTable = state.roomTables[dateRoom];
      if (roomTables[roomTable]) {
        continue;
      }

      let status;
      if (now >= roomTable.period.start && now < roomTable.period.end) {
        status = 'ACTIVE';
        expired = Math.min(expired, roomTable.period.end);
      } else if (now < roomTable.period.start) {
        status = 'UPCOMING';
        expired = Math.min(expired, roomTable.period.start);
      } else if(now >= roomTable.period.end) {
        status = 'MISSED';
      }
      if (roomTable.status != status) {
        roomTable.status = status;
        roomTable.chksum = md5(JSON.stringify(roomTable)).substr(0,6);
      }
    }
    state.expired = expired;
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
