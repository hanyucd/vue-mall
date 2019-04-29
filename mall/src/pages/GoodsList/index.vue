<template>
  <div>
    <!-- 顶部导航 -->
    <nav-header></nav-header>
    <!-- 面包屑 -->
    <nav-bread>
      <span>商品列表</span>
    </nav-bread>
    <!-- 主要内容 -->
    <section class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">排序：</span>
          <a href="javascript: void(0)" class="default cur">默认</a>
          <a href="javascript: void(0)" class="price" :class="{ 'sort-up': sortFlag }" @click="sortGoods">
            价格 
            <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg>
          </a>
          <a href="javascript: void(0)" class="filterby stopPop" @click.stop="showFilterPop">价格过滤</a>
        </div>

        <div class="accessory-result">
          <div class="filter stopPop" id="filter" :class="{ 'filterby-show': filterBy }">
            <dl class="filter-price">
              <dt>筛选:</dt>
              <dd>
                <a href="javascript: void(0)" @click="setPriceFilter('all')" :class="{ 'cur': priceChecked == 'all' }">全部</a>
              </dd>
              <dd v-for="(item, index) in priceFilter" :key="index">
                <a href="javascript: void(0)" @click="setPriceFilter(index)" :class="{ 'cur': priceChecked == index }">
                  {{ item.startPrice }} 元 - {{item.endPrice}} 元
                </a>
              </dd>
            </dl>
          </div>

          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="(item, index) in goodsList" :key="index">
                  <div class="pic">
                    <a href="#">
                      <img v-lazy="'/static/' + item.prodcutImg" alt=""/>
                    </a>
                  </div>
                  <div class="main">
                    <div class="name">{{ item.productName }}</div>
                    <div class="price">{{ item.prodcutPrice }}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
    <article class="md-overlay" v-show="overLayFlag" @click.stop="closePop"></article>
    <!-- 尾部说明 -->
    <nav-footer></nav-footer>
  </div>
</template>

<script>
import NavHeader from '@/components/NavHeader';
import NavBread from '@/components/NavBread';
import NavFooter from '@/components/NavFooter';
import axios from 'axios';

export default {
  name: 'GoodsList',
  components: {
    NavHeader,
    NavBread,
    NavFooter
  },
  data() {
    return {
      priceFilter: [
        {
          startPrice:'0.00',
          endPrice:'100.00'
        }, {
          startPrice:'100.00',
          endPrice:'500.00'
        }, {
          startPrice:'500.00',
          endPrice:'1000.00'
        }, {
          startPrice:'1000.00',
          endPrice:'5000.00'
        }
      ],
      goodsList: [],
      sortFlag: true,
      priceChecked: 'all', // 当前选中哪个价格过滤区间
      filterBy: false, // 按价格排序
      overLayFlag: false // 按价格排序遮罩层
    };
  },
  created() {
    axios.get('/goods').then(res => {
      this.goodsList = res.data.data.result;
    })
  },
  methods: {
    sortGoods() {},
    /*
     * 显示按价格排序
     */
    showFilterPop() {
      this.filterBy = true;
      this.overLayFlag = true;
    },
    /* 
     * 隐藏按价格排序
     */
    closePop() {
      this.filterBy = false;
      this.overLayFlag = false;
    },
    /*
     * 点击价格过滤
     */
    setPriceFilter(index) {
      this.priceChecked = index;
      this.closePop();
    },
    addCart(productId) {
      console.log(productId)
    }
  }
};
</script>