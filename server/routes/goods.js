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
  let page = parseInt(req.query.page, 10); // 页数
  let pageSize = parseInt(req.query.pageSize, 10); // 数据条数
  let sort = parseInt(req.query.sort, 10); // 排序方式 (升序 || 降序)
  let skip = (page - 1) * pageSize; // 跳过的数据条数 (分页的公式)
  let params = {};
  Goods.find(params) // 先查询所有 | 返回 Query 的一个实例（可链式调用）
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

module.exports = router;
