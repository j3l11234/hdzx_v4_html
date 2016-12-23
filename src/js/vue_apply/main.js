import '../common/Polyfills';
import Vue from 'vue'
import VueRouter from 'vue-router'

import store from './store';
import App from './App.vue';
import ListPage from './containers/ListPage.vue';
import DetailPage from './containers/DetailPage.vue';

const routes = [
  { path: '/', name: 'list', component: ListPage },
  { path: '/detail/:date/:room_id', name: 'detail', component: DetailPage }
]

const router = new VueRouter({
  routes 
})

Vue.use(VueRouter);

setTimeout(()=>{
  new Vue({
    el: '#apply-page',
    router,
     store,
    render: h => h(App)
  })
},300);
