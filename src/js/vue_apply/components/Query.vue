<template>
  <form @submit.prevent="onSubmit">
    <div class="row panel-collapse collapse in" id="query-collapse">
      <div class="form-group col-sm-6 col-md-4 null">
        <label class="control-label inline-label">开始日期：</label>
        <div class="inline-control">
          <input v-model="form.start_date" type="date" placeholder="开始日期" class="form-control" >
        </div>
      </div>
      <div class="form-group col-sm-6 col-md-4 null">
        <label class="control-label inline-label">结束日期：</label>
        <div class="inline-control">
          <input v-model="form.end_date" type="date" placeholder="结束日期" class="form-control" value="">
        </div>
      </div>
      <div class="form-group col-sm-6 col-md-4 null">
        <label class="control-label inline-label">每页显示：</label>
        <div class="inline-control">
          <input v-model="form.per_page" type="number" class="form-control" placeholder="每页显示" value="">
        </div>
      </div>
      <div class="form-group col-sm-6 col-md-4">
        <label class="control-label inline-label">显示图例：</label>
        <div class="inline-control">
          <div class="rt-legend z-rt-free">正常</div>
          <div class="rt-legend z-rt-ordered">申请</div>
          <div class="rt-legend z-rt-used">占用</div>
          <div class="rt-legend z-rt-locked">锁定</div>
        </div>
      </div>
      <div class="form-group col-sm-6 col-sm-offset-6 col-md-4 col-md-offset-4">
        <button type="submit" class="btn-block btn btn-primary">查找</button>
      </div>
      <div class="col-sm-12"></div>
    </div>
    <a data-toggle="collapse" href="#query-collapse" class="hr-collapse">
      <hr />
      <span class="glyphicon"></span>
    </a>
  </form>
</template>

<script>

export default {
  name: 'Query',
  components: {
  },
  data() {
    return {
      form: {
        start_date: '',
        end_date: '',
        per_page: '8'
      }
    }
  },
  computed: {},
  methods: {
    onSubmit() {
      this.$store.dispatch('getRoomTables', this.form);
    }
  },
  created () {
  }
}
</script>

