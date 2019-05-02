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
        // 服务端设置 cookie | maxAge：cookie 过期时间 1 小时
        res.cookie('userId', userDoc.userId, {
          path: '/',
          maxAge: 1000 * 60 * 60
        });
        // req.session.user = userDoc;
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

module.exports = router;
