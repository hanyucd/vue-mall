var express = require('express');
var Goods = require('../models/goods');
var Users = require('../models/users');
var router = express.Router();

/**
 * 查询商品列表数据 | 分页逻辑
 */
router.get('/', function(req, res, next) {
  // req.query：获取路由中的查询参数
  let page = parseInt(req.query.page, 10) || 1; // 页数
  let pageSize = parseInt(req.query.pageSize, 10) || 8; // 数据条数
  let sort = parseInt(req.query.sort, 10) || 1; // 排序方式 (升序 || 降序)
  let priceLevel = req.query.priceLevel; // 传过来的价格区间
  let skip = (page - 1) * pageSize; // 跳过的数据条数 (分页的公式)
  let filterParams = {}; // 价格过滤参数
  let minPrice, maxPrice;
  if (priceLevel !== 'all') {
    switch (priceLevel) {
      case '0': minPrice = 0; maxPrice = 100; break;
      case '1': minPrice = 100; maxPrice = 500; break;
      case '2': minPrice = 500; maxPrice = 1000; break;
      case '3': minPrice = 1000; maxPrice = 5000; break;
    }
    filterParams = {
      salePrice: {
        $gte: minPrice, // $gte 大于等于
        $lte: maxPrice  // $lte 小于等于
      }
    };
  }

  Goods.find(filterParams) // 先查询所有 | 返回 Query 的一个实例（可链式调用）
    .skip(skip) // skip(skip)跳过 skip 条数据
    .limit(pageSize) // limit(pageSize) 指定查询结果的最大条数
    .sort({ 'salePrice': sort }) // 对价格排序功能
    .exec(function(err, docs) { // exec(callback) 执行查询
      if (err) {
        res.json({
          status: '500',
          msg: err.message
        });
      } else {
        res.json({
          status: '200',
          count: docs.length,
          result: docs
        });
      }
    });
});

/**
 * 加入到购物车
 */
router.post('/addCart', function(req, res, next) {
  let userId = '100000077';
  let productId = req.body.productId;

  // 根据 userId 找到用户
  Users.findOne({ userId }, function(error, userDoc) {
    if (error) {
      res.json({
        status: '500',
        msg: err.message
      });
    } else {
      if (userDoc) {
        let goodsItem = '';
        // 遍历用户购物车，判断加入购物车的商品是否已经存在
        userDoc.cartList.forEach(item => {
          if (item.productId === productId) {
            goodsItem = item;
            item.productNum++; // 购物车这件商品数量 +1
          }
        });

        if (goodsItem) {
          // 若购物车该商品已存在 | 直接保存
          userDoc.save(function(error, resultDoc) {
            if (error) {
              res.json({
                status: 500,
                msg: error.message
              });
            } else {
              res.json({
                status: 200,
                msg: '',
                result: 'success'
              })
            }
          });
        } else {
          // 若购物车该商品不存在，就添加进去 | 根据商品 id 找到对应商品
          Goods.findOne({ productId }, function(error, goodDoc) {
            if (error) {
              res.json({
                status: '500',
                msg: err.message
              });
            } else {
              if (goodDoc) {
                goodDoc.checked = 1;
                goodDoc.productNum = 1;
  
                userDoc.cartList.push(goodDoc); // 添加信息到用户购物车列表中
                // 保存数据库
                userDoc.save(function(error, resultDoc) {
                  if (error) {
                    res.json({
                      status: 500,
                      msg: error.message
                    });
                  } else {
                    res.json({
                      status: 200,
                      msg: '',
                      result: 'success'
                    });
                  }
                });
              }
            }
          });
        }
      }
    }
  });
});

module.exports = router;
