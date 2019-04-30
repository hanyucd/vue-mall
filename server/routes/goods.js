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
  Goods.find({}, function(err, docs) {
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
