import Vue from 'vue';
import Router from 'vue-router';
import GoodsList from '@/pages/GoodsList';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'GoodsList',
      component: GoodsList
    }
  ]
});
