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
  let userId = req.cookies.userId; // 获取用户Id

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
    };
  });
});

/**
 * 购物车删除功能
 */
router.post('/cartDel', function(req, res, next) {
  let userId = req.cookies.userId;
  let productId = req.body.productId;
  // 数组修改器：向数组中删除指定元素
  Users.update({ userId }, { $pull: { 'cartList': { productId } } }, function(error, UserDoc) {
    if (error) {
      res.json({
        status: 500,
        msg: error.message
      });
    } else {
      res.json({
        status: 200,
        result: 'success'
      });
    }
  });
});

/**
 * 修改商品数量 和 勾选接口
 */
router.post('/cartEdit', function(req, res, next) {
  let userId = req.cookies.userId;
  let productId = req.body.productId;
  let productNum = req.body.productNum;
  let checked = req.body.checked;

  // 更新数据
  Users.update(
    { userId, 'cartList.productId': productId }, 
    { 'cartList.$.productNum': productNum },
    { 'cartList.$.checked': checked },
    function(error, userDoc) {
      if (error) {
        res.json({
          status: 500,
          msg: error.message
        });
      } else {
        res.json({
          status: 200,
          result: 'success'
        });
      }
    });
});

/**
 * 全选和取消全选
 */
router.post('/editCheckAll', function(req, res, enxt) {
  let userId = req.cookies.userId;
  let checkedAll = req.body.checkedAll ? '1' : '0';

  Users.findOne({ userId }, function(error, userDoc) {
    if (error) {
      res.json({
        status: 500,
        msg: error.message
      });
    } else {
      userDoc.cartList.forEach(item => {
        item.checked = checkedAll;
      });
      userDoc.save(function(error, userDoc) {
        if (error) {
          res.json({
            status: 500,
            msg: error.message
          });
        } else {
          console.log(userDoc.cartList)
          res.json({
            status: 200,
            result: 'success'
          });
        }
      });
    }
  });
});

module.exports = router;
