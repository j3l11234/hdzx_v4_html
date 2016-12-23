<template>
  <div class="dept-select">
    <select v-for="(select, i) in selects" :key="i" class="select-control form-control" :value="select.selected" @change="onSelect($event.target.value)" >
      <option v-for="(dept, j) in select.options" :key="j" :value="dept.id" >{{dept.name}}</option>
    </select>
  </div>
</template>

<script>

export default {
  name: 'DeptSelect',
  data () {
    return {
      dept_id : null
    }
  },
  computed: {
    selects() {
      let selects = [];
      let curDept = {parent_id: this.dept_id, id:this.dept_id}
      //遍历至根节点
      do {
        //获取选项
        let options
        if ((options = this.deptMap[curDept.parent_id])){
          if (curDept.parent_id == 0){
            options = [{id:0,name:'请选择'}].concat(options);
          }
          //如果父元素可选则添加进来
          let parentDept;
          if (curDept.parent_id != 0 && (parentDept = this.depts[curDept.parent_id]) && parentDept.choose == 1) {
            options = [parentDept].concat(options);
          }
          //获取选定值
          let selected = curDept.id;
          selects.unshift({options, selected});
        }
        curDept = this.depts[curDept.parent_id];
      } while (curDept);

      if (selects.length == 0 && this.deptMap[0]) {
        selects.push({options: [{id:0,name:'请选择'}].concat(this.deptMap[0]), selected: null});
      } 

      return selects;
    }
  },
  components: {
  },
  props: ['value', 'deptMap', 'depts'],
  methods: {
    onSelect(value) {
      if (value == -1) {
        return;
      }
      this.dept_id = value;
      this.$emit('input', Number(this.dept_id));
    }
  },
  watch: {
    value: function (val, oldVal) {
      if (val !== oldVal) {
        this.dept_id = val;
      }     
    }
  },
}
</script>