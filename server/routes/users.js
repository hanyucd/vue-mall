var express = require('express');
var Users = require('../models/users');
var router = express.Router();

/**
 * 登录处理
 */
router.post('/login', function(req, res, next) {
  let filterParam = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  };

  Users.findOne(filterParam, function(error, userDoc) {
    if (error) {
      res.json({
        status: 500,
        msg: error.message
      });
    } else {
      if (userDoc) {
        // cookie 存储用户 id | 服务端设置 cookie, maxAge：cookie 过期时间 1 小时
        res.cookie('userId', userDoc.userId, {
          path: '/',
          maxAge: 1000 * 60 * 60
        });
        // cookie 存储用户名
        res.cookie('userName', userDoc.userName, {
          path: '/',
          maxAge: 1000 * 60 * 60
        });

        res.json({
          status: 200,
          result: {
            userName: userDoc.userName
          }
        });
      }
    }
  });
});

/**
 * 登出处理
 */
router.post('/logout', function(req, res, next) {
  // 清除 cookie
  res.cookie('userId', '', {
    path: '/',
    maxAge: 0
  });
  res.json({
    status: 200,
    result: '退出登录'
  });
});

/**
 * 校验是否登录接口
 */
router.get('/checkLogin', function(req, res, next) {
  if (req.cookies.userId) {
    res.json({
      status: 200,
      result: req.cookies.userName || ''
    })
  } else {
    res.json({
      status: 401,
      result: '未登录'
    });
  }
});

/**
 * 查询当前用户的购物车数据
 */
router.get('/cartLists', function(req, res, next) {
  if (req.cookies && req.cookies.userId) {
    let userId = req.cookies.userId;

    Users.findOne({ userId }, function(error, userDoc) {
      if (error) {
        res.json({
          status: 500,
          msg: error.message
        });
      } else {
        res.json({
          status: 200,
          result: userDoc.cartList
        });
      }
    });
  } else {
    res.json({
      status: 401,
      result: '当前用户不存在'
    })
  }
});

module.exports = router;
