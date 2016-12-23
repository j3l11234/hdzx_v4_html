<template>
  <nav class="text-center">
    <ul class="pagination">
      <li v-show="total_page > page_length" :class="{ disabled: cur_page <= 1 }" >
        <a @click="onPageClick(1)">1…</a>
      </li>
      <li :class="{ disabled: cur_page <= 1 }" >
        <a @click="onPageClick(cur_page-1)" >&laquo;</a>
      </li>

      <li v-for="page in pageList" :key="page" :class="{ active: page == cur_page }" >
        <a @click="onPageClick(page)" >{{page}}</a>
      </li>

      <li :class="{ disabled: cur_page >= total_page }" >
        <a @click="onPageClick(cur_page+1)" >&raquo;</a>
      </li>
      <li v-show="total_page > page_length" :class="{ disabled: cur_page >= total_page }" >
        <a @click="onPageClick(total_page)">…{{total_page}}</a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'Pagination',
  data() {
    return {
    }
  },
  computed: {
    pageList() {
      let {page_length, cur_page, total_page} = this;
      //计算左右延长
      let left = Math.floor((page_length - 1) / 2);
      let right = page_length - (left + 1);

      //计算起始
      let start,end;
      if (cur_page < 1 + left) {
        start = 1;
        end = page_length;
      } else if(cur_page > total_page - right) {
        start = total_page - page_length + 1;
        end = total_page;
      } else {
        start = cur_page - left;
        end = cur_page + right;
      }
      start = Math.max(start, 1);
      end = Math.min(end, total_page);

      let pageList = [];
      for (let i = start; i <= end; i++) {
        pageList.push(i);
      }
      return pageList;
    }
  },
  methods: {
    onPageClick(page){
      if (page == this.cur_page) {
        return;
      }
      this.$emit('page', page);
    }
  },
  props: ['page_length', 'per_page', 'cur_page', 'total_page', 'total'],
  created () {
  }
}
</script>
