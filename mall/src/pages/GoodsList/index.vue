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
                <li v-for="item of goodsList" :key="item._id">
                  <div class="pic">
                    <a href="#">
                      <img v-lazy="'/static/' + item.productImage" alt=""/>
                    </a>
                  </div>
                  <div class="main">
                    <div class="name">{{ item.productName }}</div>
                    <div class="price">￥{{ item.salePrice }}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <!-- 滚动加载插件 -->
            <article 
              class="view-more-normal"
              v-infinite-scroll="loadMore"
              infinite-scroll-disabled="busy"
              infinite-scroll-distance="20"
            >
              <img v-show="loading" src="/static/loading-svg/loading-spinning-bubbles.svg" alt="" />
            </article>
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
      ], // 价格区间数组
      goodsList: [], // 商品列表
      page: 1, // 当前第一页
      pageSize: 8, // 一页有 8 条数据
      sortFlag: true, // 排序：默认升序
      priceChecked: 'all', // 选中价格区间
      filterBy: false, // 按价格菜单显示
      overLayFlag: false, // 遮罩层显示
      busy: true, // 滚动加载插件默认禁用
      loading: false // 往下滚动"加载图标"的出现效果
    };
  },
  created() {
    this._getGoodsList();
  },
  methods: {
    _getGoodsList(append = false) {
      // 请求参数
      let params = {
        page: this.page,
        pageSize: this.pageSize,
        sort: this.sortFlag ? 1 : -1, // sortFlag 为 true 升序
        priceLevel: this.priceChecked // 点击的价格区间
      };
      this.loading = true; // 显示加载
      
      axios.get('/goods', {
        params
      }).then(res => {
        if (res.data.status === '200') {
          this.loading = false; // 隐藏加载
          if (append) {
            // 累加数据
            this.goodsList = [...this.goodsList, ...res.data.result];
            // 数据为 0 ？ 禁用滚动触发 ：启用滚动触发
            (res.data.count === 0)
              ? this.busy = true
              : this.busy = false;
          } else {
            // 首次请求的数据处理
            this.goodsList = res.data.result;
            this.busy = false; // 启用滚动触发
          }
        } else {
          this.goodsList = [];
        }
      });
    },
    /*
     * 点击排序商品
     */
    sortGoods() {
      this.sortFlag = !this.sortFlag;
      this.page = 1; // 点击价格排序后从第一页开始
      this._getGoodsList();
    },
    /*
     * 加载更多
     */
    loadMore() {
      this.busy = true; // 滚动就禁用，防止下一个滚动
      setTimeout(() => {
        this.page++;
        this._getGoodsList(true); // 滚动加载是累加数据，需要传参去请求数据的地方判断一下
      }, 500);
    },
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
      this._getGoodsList();
    },
    addCart(productId) {
      console.log(productId)
    }
  }
};
</script>