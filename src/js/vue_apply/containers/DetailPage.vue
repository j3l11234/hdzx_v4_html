<template>
  <div>
    <!-- Nav tabs -->
    <ul class="nav nav-tabs" role="tablist">
      <li role="presentation"><a href="javascript:void(0)" @click="goToListPage">&lt;房间浏览</a></li>
      <li role="presentation" class="active"><a href="#tab-submit" role="tab" data-toggle="tab">提交申请</a></li>
      <li role="presentation"><a href="#tab-usage" role="tab" data-toggle="tab">使用情况</a></li>
    </ul>

    <!-- Tab panes -->
    <div class="tab-content">
      <div role="tabpanel" class="tab-pane active" id="tab-submit">
        <ApplyForm />
      </div>
      <div role="tabpanel" class="tab-pane" id="tab-usage">
        <RoomUsage />
      </div>
    </div>
  </div>
</template>

<script>
import ApplyForm from '../components/ApplyForm.vue';
import RoomUsage from '../components/RoomUsage.vue';

export default {
  name: 'DetailPage',
  components: {
    ApplyForm,
    RoomUsage
  },
  created() {
    
  },
  mounted() {
    this.$store.dispatch('apply_chooseDateRoom', this.$route.params);
  },
  computed: {
    dateRoom() {
      let { date, room_id } = this.$store.state.apply.detail;
      return { date, room_id };
    }
  },
  methods: {
    goToListPage() {
      this._fromList ? 
        this.$router.go(-1) :
        this.$router.replace({path: '/'});
    }
  },
  watch: {
    $route: function (val, oldVal) {
      if (val.name === 'detail' && 
        (val.params.date != this.dateRoom.date || val.params.room_id != this.dateRoom.room_id)) {
        this.$store.dispatch('apply_chooseDateRoom', val.params);
      }
    },
    dateRoom(val, oldVal) {
      if (this.$route.name === 'detail' && 
        (val.date != oldVal.date || val.room_id != oldVal.room_id)) {
        this.$router.replace({ name: 'detail', params: val});
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm._fromList = (from.name == 'list');
      document.body.scrollTop = 0;
    });
  },
}
</script>

