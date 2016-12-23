<template>
  <div> 
    <Query />
    <RoomTable />
    <Pagination page_length="5" :total="page.total" :per_page="page.per_page" :cur_page="page.cur_page" :total_page="page.total_page" @page="onPage" />
  </div>
</template>

<script>
import RoomTable from '../components/RoomTable.vue';
import Query from '../components/Query.vue';
import Pagination from '../../common/components_vue/Pagination.vue';

export default {
  name: 'ListPage',
  components: {
    Query,
    RoomTable,
    Pagination
  },
  computed: {
    page() {
      return this.$store.state.roomTable.page;
    }
  },
  methods:{
    onPage(page) {
      this.$store.dispatch('apply_page',{page});
    }
  },
  created() {
    this.$store.dispatch('getRoomTables',{start_date:'', end_date:''});
  }
}
</script>

