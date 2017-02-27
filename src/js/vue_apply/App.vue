<template>
  <keep-alive> 
    <router-view></router-view>
  </keep-alive> 
</template>

<script>


export default {
  name: 'app',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  components: {
  },
  created () {
    this.$store.dispatch('getMetaData', {page:'order'});
    this.$store.dispatch('getLogin').then(({ user }) => {
      if (!user) {
        stickAlert('warning', '您尚未登录，请先登录');
      }
    });
    setInterval(() => {
      this.$store.dispatch('roomtable_refreshTime');
    },1000);
  }
}
</script>

<style>



#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
/*h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
a {
  color: #42b983;
}*/
</style>