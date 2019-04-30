var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods');

// 连接数据库 数据库的名称叫 vue_mall
mongoose.connect('mongodb://127.0.0.1:27017/vue_mall');

// 连接成功操作
mongoose.connection.on('connected', function() {
  console.log("MongooDB 连接成功.");
});
// 连接失败操作
mongoose.connection.on('error', function() {
  console.log("MongooDB 连接失败.");
});
// 连接断开操作
mongoose.connection.on('disconnected', function() {
  console.log("MongooDB 断开连接.");
});

/* GET home page. */
router.get('/', function(req, res, next) {
  // req.query：获取路由中的查询参数
  let page = parseInt(req.query.page, 10);
  let pageSize = parseInt(req.query.pageSize, 10);
  let sort = parseInt(req.query.sort, 10);
  // 跳过的数据条数，(分页的公式).
  let skip = (page - 1) * pageSize;
  let params = {};
  // 先查询所有，skip(skip)跳过skip条数据，limit(pageSize)一页多少条数据.即分页功能实现
  let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
  // 对价格排序功能
  goodsModel.sort({ 'salePrice': sort });
  goodsModel.exec(function(err, docs) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      res.json({
        status: '0',
        result: {
          count: docs.length,
          list: docs
        }
      })
    }
  });
});

module.exports = router;
