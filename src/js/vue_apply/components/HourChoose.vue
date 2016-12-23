<template>
  <div class="hour-choose">
    <svg class="main" width="420" height="30" @click="onHourClick">
      <rect x="2" y="2" width="26" height="26" rx="3" ry="3" data-hour="8" :fill="tableColor[8].bgColor" />
      <text x="15" y="15" font-size="16" data-hour="8" :fill="tableColor[8].textColor" text-anchor="middle" dominant-baseline="central">8</text>
      <rect x="32" y="2" width="26" height="26" rx="3" ry="3" data-hour="9" :fill="tableColor[9].bgColor" />
      <text x="45" y="15" font-size="16" data-hour="9" :fill="tableColor[9].textColor" text-anchor="middle" dominant-baseline="central">9</text>
      <rect x="62" y="2" width="26" height="26" rx="3" ry="3" data-hour="10" :fill="tableColor[10].bgColor" />
      <text x="75" y="15" font-size="16" data-hour="10" :fill="tableColor[10].textColor" text-anchor="middle" dominant-baseline="central">10</text>
      <rect x="92" y="2" width="26" height="26" rx="3" ry="3" data-hour="11" :fill="tableColor[11].bgColor" />
      <text x="105" y="15" font-size="16" data-hour="11" :fill="tableColor[11].textColor" text-anchor="middle" dominant-baseline="central">11</text>
      <rect x="122" y="2" width="26" height="26" rx="3" ry="3" data-hour="12" :fill="tableColor[12].bgColor" />
      <text x="135" y="15" font-size="16" data-hour="12" :fill="tableColor[12].textColor" text-anchor="middle" dominant-baseline="central">12</text>
      <rect x="152" y="2" width="26" height="26" rx="3" ry="3" data-hour="13" :fill="tableColor[13].bgColor" />
      <text x="165" y="15" font-size="16" data-hour="13" :fill="tableColor[13].textColor" text-anchor="middle" dominant-baseline="central">13</text>
      <rect x="182" y="2" width="26" height="26" rx="3" ry="3" data-hour="14" :fill="tableColor[14].bgColor" />
      <text x="195" y="15" font-size="16" data-hour="14" :fill="tableColor[14].textColor" text-anchor="middle" dominant-baseline="central">14</text>
      <rect x="212" y="2" width="26" height="26" rx="3" ry="3" data-hour="15" :fill="tableColor[15].bgColor" />
      <text x="225" y="15" font-size="16" data-hour="15" :fill="tableColor[15].textColor" text-anchor="middle" dominant-baseline="central">15</text>
      <rect x="242" y="2" width="26" height="26" rx="3" ry="3" data-hour="16" :fill="tableColor[16].bgColor" />
      <text x="255" y="15" font-size="16" data-hour="16" :fill="tableColor[16].textColor" text-anchor="middle" dominant-baseline="central">16</text>
      <rect x="272" y="2" width="26" height="26" rx="3" ry="3" data-hour="17" :fill="tableColor[17].bgColor" />
      <text x="285" y="15" font-size="16" data-hour="17" :fill="tableColor[17].textColor" text-anchor="middle" dominant-baseline="central">17</text>
      <rect x="302" y="2" width="26" height="26" rx="3" ry="3" data-hour="18" :fill="tableColor[18].bgColor" />
      <text x="315" y="15" font-size="16" data-hour="18" :fill="tableColor[18].textColor" text-anchor="middle" dominant-baseline="central">18</text>
      <rect x="332" y="2" width="26" height="26" rx="3" ry="3" data-hour="19" :fill="tableColor[19].bgColor" />
      <text x="345" y="15" font-size="16" data-hour="19" :fill="tableColor[19].textColor" text-anchor="middle" dominant-baseline="central">19</text>
      <rect x="362" y="2" width="26" height="26" rx="3" ry="3" data-hour="20" :fill="tableColor[20].bgColor" />
      <text x="375" y="15" font-size="16" data-hour="20" :fill="tableColor[20].textColor" text-anchor="middle" dominant-baseline="central">20</text>
      <rect x="392" y="2" width="26" height="26" rx="3" ry="3" data-hour="21" :fill="tableColor[21].bgColor" />
      <text x="405" y="15" font-size="16" data-hour="21" :fill="tableColor[21].textColor" text-anchor="middle" dominant-baseline="central">21</text>
    </svg>
    <div v-once>
      <label>图例:</label>
      <svg class="legend" width="250" height="30">
        <rect x="2" y="2" width="46" height="26" rx="3" ry="3" data-hour="8" :fill="legendColor[1].bgColor" />
        <text x="25" y="15" font-size="16" data-hour="8" :fill="legendColor[1].textColor" text-anchor="middle" dominant-baseline="central">可选</text>
        <rect x="52" y="2" width="46" height="26" rx="3" ry="3" data-hour="9" :fill="legendColor[2].bgColor" />
        <text x="75" y="15" font-size="16" data-hour="9" :fill="legendColor[2].textColor" text-anchor="middle" dominant-baseline="central">选中</text>
        <rect x="102" y="2" width="46" height="26" rx="3" ry="3" data-hour="10" :fill="legendColor[3].bgColor" />
        <text x="125" y="15" font-size="16" data-hour="10" :fill="legendColor[3].textColor" text-anchor="middle" dominant-baseline="central">申请</text>
        <rect x="152" y="2" width="46" height="26" rx="3" ry="3" data-hour="11" :fill="legendColor[4].bgColor" />
        <text x="175" y="15" font-size="16" data-hour="11" :fill="legendColor[4].textColor" text-anchor="middle" dominant-baseline="central">占用</text>
        <rect x="202" y="2" width="46" height="26" rx="3" ry="3" data-hour="12" :fill="legendColor[5].bgColor" />
        <text x="225" y="15" font-size="16" data-hour="12" :fill="legendColor[5].textColor" text-anchor="middle" dominant-baseline="central">锁定</text>
      </svg>
    </div>
    <div :class="{'has-error': error}">
      <label>时段：</label>
      <span>从<span class="text-hour">{{hourRange.start_hour ? hourRange.start_hour : ''}}</span>时到<span class="text-hour">{{hourRange.end_hour ? hourRange.end_hour : ''}}</span>时，(最长{{maxHour}}小时)</span>
    </div>
    
  </div>
</template>

<script>
// .z-rt-choosen {
//     background: #30971D;
//     color: #fff
// }
import { STATUS, COLOR } from '../../common/constants/RoomTable.js';
import { range2Hours, hours2Range } from '../../common/units/Helpers';

const legendColor = {
  [1]: COLOR[STATUS.FREE],
  [2]: COLOR[STATUS.CHOOOSED],
  [3]: COLOR[STATUS.ORDERED],
  [4]: COLOR[STATUS.USED],
  [5]: COLOR[STATUS.LOCKED],
};

export default {
  name: 'HourChoose',
  data () {
    return {
      chooseHour: -1,
    }
  },
  computed: {
    hourRange() {
      if (this.chooseHour == -1) {
        return hours2Range(this.value);
      } else {
        return {
          start_hour: null,
          end_hour: null
        }
      }
    },
    tableColor: function () {
      let colors = {};
      if (this.hourTable) {
        let start_hour,end_hour;
        if (this.chooseHour == -1) {
          if (!this.error) {
            let range = hours2Range(this.value);
            start_hour = range.start_hour;
            end_hour = range.end_hour;
          }
        } else { //已经选择开始时间
          start_hour = this.chooseHour;
          end_hour = this.chooseHour+1;
        }
        for (var i = 8; i <= 21; i++) {
          if (i>=start_hour && i < end_hour) {
            colors[i] = COLOR[STATUS.CHOOOSED];
          } else {
            colors[i] = COLOR[this.hourTable[i]];
          }
        } 
      } else {
        for (var i = 8; i <= 21; i++) {
          colors[i] = COLOR[STATUS.FREE];
        }
      }
      return colors;
    },
    legendColor: function() {
      return legendColor;
    }
  },
  components: {
  },
  props: ['hourTable', 'maxHour', 'value', 'error'],
  methods: {
    onHourClick(event) {
      let target = event.target;
      if (target.tagName != 'rect' && target.tagName != 'text') {
        return;
      }

      let hour = parseInt(target.attributes['data-hour'].value);
      let start_hour,end_hour;

      if (this.chooseHour == -1) { //未选择开始时间
        if (this.hourTable[hour] == STATUS.FREE ||
          this.hourTable[hour] == STATUS.ORDERED) {
          this.chooseHour = hour;
        }
        return;
      }

      //已经选择开始时间
      //开始结束判断
      if(this.chooseHour <= hour){ 
        start_hour = this.chooseHour;
        end_hour = hour+1;
      } else {
        start_hour = hour;
        end_hour = this.chooseHour + 1;
      }
      this.chooseHour = -1;

      let hours = range2Hours(start_hour, end_hour);
      this.$emit('input', hours);
    },
    validate(hours) {
      let isValid = true;
      if(!this.maxHour || hours.length <= this.maxHour) {
        //区间判断
        for (let i in hours) {
          let h = hours[i];
          if (this.hourTable[h] != STATUS.FREE &&
              this.hourTable[h] != STATUS.ORDERED) {
            isValid = false;
            break; 
          }
        }
      } else {
        isValid = false;
      }
      return isValid;
    }
  },
  watch: {
    value: function (val, oldVal) {
      if (val !== oldVal) {
        this.chooseHour == -1;
      }     
    }
  },
}

</script>