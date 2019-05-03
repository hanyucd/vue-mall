<template>
  <div>
    <!-- 头部组件 -->
    <nav-header></nav-header>
    <!-- 中间内容 -->
    <section class="container">
      <div class="page-title-normal">
        <h2 class="page-title-h2"><span>check out</span></h2>
      </div>
      <!-- 进度条 -->
      <div class="check-step">
        <ul>
          <li class="cur"><span>确定地址</span></li>
          <li class="cur"><span>查看订单</span></li>
          <li class="cur"><span>付款</span></li>
          <li class="cur"><span>订单确认</span></li>
        </ul>
      </div>

      <div class="order-create">
        <div class="order-create-pic"><img src="/static/ok-2.png" alt=""></div>
        <div class="order-create-main">
          <h3>恭喜! <br>您的订单正在处理中!</h3>
          <p>
            <span>订单 ID：{{ orderId }}</span>
            <span>订单总价：{{ orderTotal | currency('￥') }}</span>
          </p>
          <div class="order-create-btn-wrap">
            <div class="btn-l-wrap">
              <router-link class="btn btn--m" to="/cart">返回购物车</router-link>
            </div>
            <div class="btn-r-wrap">
              <router-link class="btn btn--m" to="/">返回首页</router-link>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- 底部组件 -->
    <nav-footer></nav-footer>
  </div>
</template>

<script>
import NavHeader from '@/components/NavHeader';
import NavFooter from '@/components/NavFooter';
import { currency } from '@/util/currency';  // 对价格格式化的通用方法
import axios from 'axios';

export default {
  name: 'OrderSuccess',
  components: {
    NavHeader,
    NavFooter
  },
  data() {
    return {
      orderId: '',  // 订单id
      orderTotal: 0  // 订单总金额
    };
  },
  filters: {
    currency
  },
  created() {
    this._getOrderInfo();
  },
  methods: {
    /**
     * 获取订单信息
     */
    _getOrderInfo() {
      let orderId = this.$route.query.orderId;
      if (!orderId) return;

      axios.get('/users/orderDetail', { params: { orderId } })
        .then(res => {
          if (res.data.status === 200) {
            this.orderId = res.data.result.orderId;
            this.orderTotal = res.data.result.orderTotal;
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>