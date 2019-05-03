import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

/*
 * 路由懒加载 | 异步加载组件
 */
const GoodsList = () => import('@/pages/GoodsList'); // 商品列表
const Cart = () => import('@/pages/Cart'); // 购物车列表
const Address = () => import('@/pages/Address'); // 购物车列表

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'GoodsList',
      component: GoodsList
    }, 
    {
      path: '/cart',
      name: 'Cart',
      component: Cart
    },
    {
      path: '/address',
      name: 'Address',
      component: Address
    }
  ]
});
