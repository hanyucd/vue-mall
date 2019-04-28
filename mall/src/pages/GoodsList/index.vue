<template>
  <div>
    <!-- 顶部导航 -->
    <nav-header></nav-header>
    <!-- 面包屑 -->
    <nav-bread>
      <span>商品列表</span>
    </nav-bread>
    <!-- 尾部说明 -->
    <nav-footer></nav-footer>
  </div>
</template>

<script>
import NavHeader from '@/components/NavHeader';
import NavBread from '@/components/NavBread';
import NavFooter from '@/components/NavFooter';

export default {
  name: 'GoodsList',
  components: {
    NavHeader,
    NavBread,
    NavFooter
  },
  data() {
    return {
    };
  }
};
</script>