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

    <!-- 模态框 -->
    <modal :mdShow="mdShow" v-on:close="closeModal">
      <p slot="message">
        请先登录, 否则无法加入到购物车中!
      </p>
      <div slot="btnGroup">
        <a class="btn btn--m" href="javascript:;" @click="mdShow = false">关闭</a>
      </div>
    </modal>
    <!-- 购物模态框 -->
    <modal :mdShow="mdShowCart" v-on:close="closeModal">
      <p slot="message">
        <svg class="icon-status-ok">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
        </svg>
        <span>加入购物车成功</span>
      </p>
      <div slot="btnGroup">
        <a class="btn btn--m" href="javascript:;" @click="mdShowCart = false">继续购物</a>
        <router-link class="btn btn--m btn--red" to="/cart">查看购物车</router-link>
      </div>
    </modal>

    <article class="md-overlay" v-show="overLayFlag" @click.stop="closePop"></article>
    <!-- 尾部说明 -->
    <nav-footer></nav-footer>
  </div>
</template>

<script>
import NavHeader from '@/components/NavHeader';
import NavBread from '@/components/NavBread';
import NavFooter from '@/components/NavFooter';
import Modal from '@/components/Modal';
import axios from 'axios';

export default {
  name: 'GoodsList',
  components: {
    NavHeader,
    NavBread,
    NavFooter,
    Modal
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
      loading: false, // 往下滚动"加载图标"的出现效果
      mdShow: false, // 未登录的模态框是否显示
      mdShowCart: false, // 已登录的模态框是否显示
    };
  },
  created() {
    this._getGoodsList();
  },
  methods: {
    /**
     * 获取商品数据
     */
    _getGoodsList(append = false) {
      // 请求参数
      let params = {
        page: this.page,
        pageSize: this.pageSize,
        sort: this.sortFlag ? 1 : -1, // sortFlag 为 true 升序
        priceLevel: this.priceChecked // 点击的价格区间
      };
      this.loading = true; // 显示加载
      
      axios.get('/goods/list', {
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
    /**
     * 点击排序商品
     */
    sortGoods() {
      this.sortFlag = !this.sortFlag;
      this.page = 1; // 点击价格排序后从第一页开始
      this._getGoodsList();
    },
    /**
     * 加载更多
     */
    loadMore() {
      this.busy = true; // 滚动就禁用，防止下一个滚动
      setTimeout(() => {
        this.page++;
        this._getGoodsList(true); // 滚动加载是累加数据，需要传参去请求数据的地方判断一下
      }, 500);
    },
    /**
     * 显示按价格排序
     */
    showFilterPop() {
      this.filterBy = true;
      this.overLayFlag = true;
    },
    /** 
     * 隐藏按价格排序
     */
    closePop() {
      this.filterBy = false;
      this.overLayFlag = false;
      this.mdShowCart = false;
    },
    /**
     * 点击价格过滤
     */
    setPriceFilter(index) {
      this.priceChecked = index;
      this.page = 1;
      this.closePop();
      this._getGoodsList();
    },
    /**
     * 点击加入购物车
     */
    addCart(productId) {
      axios.post('/goods/addCart', {
        productId
      }).then(res => {
        if (res.data.status == 200) {
          // 加入购物车成功，成功的模态框显示
          this.mdShowCart = true;
          this.$store.commit("updateCartCount", 1);
        } else {
          // 未登录模态框显示
          this.mdShow = true;
          throw new Error('request fail.');
        }
      }).catch(error => {
        console.log(error);
      });
    },
    /**
     * 关闭模态框
     */
    closeModal() {
      this.mdShow = false; // 未登录模态框消失
      this.mdShowCart = false; // 登录模态框消失
    }
  }
};
</script>