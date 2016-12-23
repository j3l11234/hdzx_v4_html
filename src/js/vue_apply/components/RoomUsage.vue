<template>
  <div class="row room-usage scrollspy" id="room-usage">
    <div class="col-md-3 col-sm-3">
      <ul ref="sidebar" class="nav nav-sidebar"> 
        <li>
          <a data-target="#usage-header-1" href="javascript:void(0)">该时段的申请</a>
        </li>
        <li>
          <a data-target="#usage-header-2" href="javascript:void(0)">该时段的锁定</a>
        </li>
      </ul>
    </div>
    <div class="col-md-9 col-sm-9">

      <h2 id="usage-header-1" class="page-header">该时段的申请</h2>
      <div v-for="order in [].concat(orderList.used,orderList.ordered,orderList.rejected)" v-if="extInfo = getOrderExtInfo(order)" :key="order.id" :class="'order-item '+ extInfo.className">
        <div class="title">{{order.title}}</div>
        <hr class="small">
        <div class="info-table">
          <div class="info-row">
            <div class="info-cell"><label>学号：</label>{{order.student_no}}</div>
            <div class="info-cell"><label>房间：</label>{{order.room_name}}</div>
            <div class="info-cell"><label>时段：</label>{{`${order.date} ${extInfo.hours.start_hour}时 - ${extInfo.hours.end_hour}时`}}</div>
          </div>
          <div class="info-row">
            <div class="info-cell"><label>单位：</label>{{order.dept_name}}</div>
            <div class="info-cell"><label>状态：</label><StatusLabel :status="order.status"/></div>
            <div class="info-cell"><label>提交：</label>{{extInfo.submit_time}}</div>
          </div>
        </div>
      </div>

      <h2 id="usage-header-2" class="page-header">该时段的锁定</h2>
      <div v-for="lock in lockList" v-if="extInfo = getLockExtInfo(lock)" :key="lock.id" class="lock-item">
        <div class="title">{{lock.title}}</div>
        <hr class="small">
        <div class="info-table">
          <div class="info-row">
            <div class="info-cell"><label>日期：</label>{{extInfo.date}}</div>
            <div class="info-cell"><label>时段：</label>{{`${extInfo.hours.start_hour}时 - ${extInfo.hours.end_hour}时`}}</div>
          </div>
        </div>
      </div>

    </div>
  </div>
 

</template>



<script>
import $ from 'jquery';
import { STATUS, COLOR } from '../../common/constants/RoomTable.js';
import { STATUS as ORDER_STATUS } from '../../common/constants/Order.js';
import { LOOP, WEEKDAY } from '../../common/constants/Lock';

import StatusLabel from '../../common/components_vue/StatusLabel.vue';
import { getListFormTable, hours2Range, getOrderAbsStatus } from '../../common/units/Helpers';
// const OrderItem = {
//   name: 'OrderItem',
//   render: '#hello-world-template',
//   props: ['order']
// }

const _orderStatusClassMap = {
  [ORDER_STATUS.STATUS_PENDING]: 'pending',
  [ORDER_STATUS.STATUS_APPROVED]: 'approved',
  [ORDER_STATUS.STATUS_REJECTED]: 'rejected'
}

export default {
  name: 'RoomUsage',
  computed: {
    roomTable() {
      let { date, room_id } = this.$store.state.apply.detail;
      let { roomTables } = this.$store.state.roomTable;

      if (date && room_id && roomTables[date+'_'+room_id]) {
        return roomTables[date+'_'+room_id];
      }
      return {};
    },
    entity() {
      return this.$store.state.entity;
    },
    orderList() {
      let used = getListFormTable(this.roomTable.used).map((order_id)=>{
        return this.entity.orders[order_id];
      });
      let ordered = getListFormTable(this.roomTable.ordered).map((order_id)=>{
        return this.entity.orders[order_id];
      });
      let rejected = getListFormTable(this.roomTable.rejected).map((order_id)=>{
        return this.entity.orders[order_id];
      });
      return { used, ordered, rejected }
    },
    lockList: function () {
      let lock_idList = getListFormTable(this.roomTable.locked);

      return lock_idList.map((lock_id)=>{
        return this.entity.locks[lock_id];
      });
    },
  },
  components: {
    StatusLabel
  },
  methods: {
    getOrderExtInfo(order) {
      if (!order){
        return;
      }
      let submit_time = (new Date(order.submit_time*1000)).Format('yyyy-MM-dd hh:mm:ss');
      let hours = hours2Range(order.hours);
      let className = _orderStatusClassMap[getOrderAbsStatus(order.status)]; 
      return { className, hours, submit_time };
    },
    getLockExtInfo(lock) {
      if (!lock){
        return;
      }
      let date;
      if(lock.loop_type == LOOP.DAY) {
        date = lock.start_date == lock.end_date ? lock.start_date : '每日';
      } else if(lock.loop_type == LOOP.WEEK) {
        date = '每周' + WEEKDAY[lock.loop_day];
      } else if(lock.loop_type == LOOP.MONTH) {
        date = '每月' + lock.loop_day + '日';
      }

      let hours = hours2Range(lock.hours);
      return { hours, date };
    }
  },
  watch: {
  },
  mounted() {
    $(document.body).scrollspy({
      target: '.scrollspy',
      offset: 80
    });
    $(this.$refs.sidebar).affix({
      offset: {
        top: 120,
        bottom: function () {
          return (this.bottom = $('.footer').outerHeight(true))
        }
      }
    });
  },
}

</script>