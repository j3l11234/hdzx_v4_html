<template>
  <div class="roomtable">
    <ul ref="header" class="date-list" @scroll="onScroll">
      <li class="date-item" v-for="date in roomTable.dateList" v-bind:key="date">
        {{date}}
      </li>
    </ul>
    <ul class="room-list">
      <li class="room-item" v-for="room_id in pagedRoomList" v-bind:key="room_id">
        <template v-if="rooms[room_id]">
          <div class="text">{{rooms[room_id].name}}<br />{{rooms[room_id].number}}</div>
        </template>
      </li>
    </ul>
    <div ref="content" class="roomtable-content" @scroll="onScroll">
      <svg :width="roomTable.dateList.length*90" :height="pagedRoomList.length*90">
      <defs>
        <filter id="f1" x="0" y="0" width="120%" height="120%">
          <feOffset result="offOut" in="SourceAlpha" dx="2" dy="2" />
          <feGaussianBlur result="blurOut" in="offOut" stdDeviation="2" />
          <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
        </filter>
      </defs>
        <g :transform="`translate(0, ${i*90})`" v-for="(room_id, i) in pagedRoomList" :key="room_id">
          <g :transform="`translate(${j*90}, 0)`" v-for="(date, j) in roomTable.dateList" :key="date" @click="onCellClick(date, room_id, $event)">
            <Cell v-if="roomTable.roomTables[date+'_'+room_id]" :roomTable="roomTable.roomTables[date+'_'+room_id]"/>
          </g>
        </g>
      </svg>
    </div>
  </div>
</template>

<script>
import { STATUS, COLOR } from '../../common/constants/RoomTable.js';
import { getPageLimit } from '../../common/units/Helpers';

/*
let _hourCellPos = (function(parentPadding, margin, sideLength){
  let pos = {};
  for (var x = 1; x <= 4; x++) {
    for (var y = 1; y <= 4; y++) {
      pos[y+'_'+x] = {
        rectX: parentPadding + margin + (x-1)*sideLength,
        rectY: parentPadding + margin + (y-1)*sideLength,
        textX: parentPadding + (x-0.5)*sideLength,
        textY: parentPadding + (y-0.5)*sideLength,
      };
    }
  }
  return pos;
})(5, 1, 20);
*/

const Cell = {
  name: 'RoomTableCell',
  render: function (createElement) {
    //console.log('render');
    let { hourTable, status, period } = this.roomTable;
    let caption = '';
    let isActive = false;
    if (status == 'UPCOMING') {
      isActive = true;
      let startTime = new Date(period.start*1000);
      caption = '\
<circle cx="45" cy="45" r="40" fill="rgba(255, 0, 0, 0.3)" />\
<text x="45" y="45" font-size="13" fill="#fff" text-anchor="middle" dominant-baseline="central"  filter="url(#f1)">\
  <tspan x="45" y="33">'+startTime.Format('yyyy-MM-dd')+'</tspan>\
  <tspan x="45" dy="16">'+startTime.Format('hh:mm:ss')+'</tspan>\
  <tspan x="45" dy="16">开放申请</tspan>\
</text>';
    } else if(status == 'MISSED') {
      isActive = true;
      caption = '\
<circle cx="45" cy="45" r="40" fill="rgba(255, 0, 0, 0.3)" />\
<text x="45" y="45" font-size="13" fill="#fff" text-anchor="middle" dominant-baseline="central"  filter="url(#f1)">\
  <tspan x="45" y="35">该时段</tspan>\
  <tspan x="45" dy="20">不可申请</tspan>\
</text>';
    }
    let html = '\
<rect class="choosen" x="3" y="3" width="84" height="84" rx="3" ry="3" fill="transparent"></rect>\
<rect x="6" y="6" width="18" height="18" rx="3" ry="3" fill="'+COLOR[hourTable[8]].bgColor+'"></rect>\
<text x="15" y="15" font-size="12" fill="'+COLOR[hourTable[8]].textColor+'" text-anchor="middle" dominant-baseline="central">8</text>\
<rect x="26" y="6" width="18" height="18" rx="3" ry="3" fill="'+COLOR[hourTable[9]].bgColor+'"></rect>\
<text x="35" y="15" font-size="12" fill="'+COLOR[hourTable[9]].textColor+'" text-anchor="middle" dominant-baseline="central">9</text>\
<rect x="46" y="6" width="18" height="18" rx="3" ry="3" fill="'+COLOR[hourTable[10]].bgColor+'"></rect>\
<text x="55" y="15" font-size="12" fill="'+COLOR[hourTable[10]].textColor+'" text-anchor="middle" dominant-baseline="central">10</text>\
<rect x="66" y="6" width="18" height="18" rx="3" ry="3" fill="'+COLOR[hourTable[11]].bgColor+'"></rect>\
<text x="75" y="15" font-size="12" fill="'+COLOR[hourTable[11]].textColor+'" text-anchor="middle" dominant-baseline="central">11</text>\
<rect x="6" y="26" width="18" height="18" rx="3" ry="3" fill="'+COLOR[hourTable[12]].bgColor+'"></rect>\
<text x="15" y="35" font-size="12" fill="'+COLOR[hourTable[12]].textColor+'" text-anchor="middle" dominant-baseline="central">12</text>\
<rect x="26" y="26" width="18" height="18" rx="3" ry="3" fill="'+COLOR[hourTable[13]].bgColor+'"></rect>\
<text x="35" y="35" font-size="12" fill="'+COLOR[hourTable[13]].textColor+'" text-anchor="middle" dominant-baseline="central">13</text>\
<rect x="46" y="26" width="18" height="18" rx="3" ry="3" fill="'+COLOR[hourTable[14]].bgColor+'"></rect>\
<text x="55" y="35" font-size="12" fill="'+COLOR[hourTable[14]].textColor+'" text-anchor="middle" dominant-baseline="central">14</text>\
<rect x="6" y="46" width="18" height="18" rx="3" ry="3" fill="'+COLOR[hourTable[15]].bgColor+'"></rect>\
<text x="15" y="55" font-size="12" fill="'+COLOR[hourTable[15]].textColor+'" text-anchor="middle" dominant-baseline="central">15</text>\
<rect x="26" y="46" width="18" height="18" rx="3" ry="3" fill="'+COLOR[hourTable[16]].bgColor+'"></rect>\
<text x="35" y="55" font-size="12" fill="'+COLOR[hourTable[16]].textColor+'" text-anchor="middle" dominant-baseline="central">16</text>\
<rect x="46" y="46" width="18" height="18" rx="3" ry="3" fill="'+COLOR[hourTable[17]].bgColor+'"></rect>\
<text x="55" y="55" font-size="12" fill="'+COLOR[hourTable[17]].textColor+'" text-anchor="middle" dominant-baseline="central">17</text>\
<rect x="66" y="46" width="18" height="18" rx="3" ry="3" fill="'+COLOR[hourTable[18]].bgColor+'"></rect>\
<text x="75" y="55" font-size="12" fill="'+COLOR[hourTable[18]].textColor+'" text-anchor="middle" dominant-baseline="central">18</text>\
<rect x="6" y="66" width="18" height="18" rx="3" ry="3" fill="'+COLOR[hourTable[19]].bgColor+'"></rect>\
<text x="15" y="75" font-size="12" fill="'+COLOR[hourTable[19]].textColor+'" text-anchor="middle" dominant-baseline="central">19</text>\
<rect x="26" y="66" width="18" height="18" rx="3" ry="3" fill="'+COLOR[hourTable[20]].bgColor+'"></rect>\
<text x="35" y="75" font-size="12" fill="'+COLOR[hourTable[20]].textColor+'" text-anchor="middle" dominant-baseline="central">20</text>\
<rect x="46" y="66" width="18" height="18" rx="3" ry="3" fill="'+COLOR[hourTable[21]].bgColor+'"></rect>\
<text x="55" y="75" font-size="12" fill="'+COLOR[hourTable[21]].textColor+'" text-anchor="middle" dominant-baseline="central">21</text>'
+ caption;
    return createElement(
      'g',
      {
        'class': {
          'roomtable-cell': true,
          'disabled': isActive,
        },
        domProps: {
          innerHTML: html
        },
      }
    );
  },
  props: ['roomTable']
}

export default {
  name: 'RoomTable',
  data () {
    return {
    }
  },
  computed: {
    roomTable() {
      return this.$store.state.roomTable;
    },
    pagedRoomList() {
      let { cur_page, total, per_page } = this.roomTable.page;
      let pageLimit = getPageLimit(cur_page, total, per_page);
      return this.roomTable.roomList.slice(pageLimit.start, pageLimit.end)
    },
    rooms() {
      return this.$store.state.entity.rooms;
    }
  },
  components: {
    Cell,
  },
  created () {
    this.scroll = {
      lastEl: '',
      lastTime: 0,
    }
  },
  methods: {
    onScroll(e) {
      let { content, header } = this.$refs;
      let time = new Date().getTime();
      if(e.target === content) {
        if (this.scroll.lastEl != 'content' && time - this.scroll.lastTime < 200) {
          return;
        }
        header.scrollLeft  = e.target.scrollLeft;
        this.scroll.lastEl = 'content';
        this.scroll.lastTime = time;
      } else if(e.target === header) {
        if (this.scroll.lastEl != 'header' && time - this.scroll.lastTime < 200) {
          return;
        }
        content.scrollLeft  = e.target.scrollLeft;
        this.scroll.lastEl = 'header';
        this.scroll.lastTime = time;
      }
    },
    onCellClick(date, room_id, e) {
      this.$router.push({ name: 'detail', params: { date, room_id}})
    }
  }
}

</script>
