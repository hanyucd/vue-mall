var express = require('express');
var Users = require('../models/users');
var router = express.Router();

require('../util/util');

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

/***************************************************
 * 查询购物车商品数量
 */
router.get('/getCartCount', function(req, res, next) {
  if (req.cookies.userId) {
    let userId = req.cookies.userId;

    Users.findOne({ userId }, (error, userDoc) => {
      if (error) {
        res.json({
          status: 500,
          msg: error.message
        });
      } else {
        let cartCount = 0;
        userDoc.cartList.map(item => {
          cartCount += parseInt(item.productNum, 10);
        });
        res.json({
          status: 200,
          result: cartCount
        });
      }
    });
  } else {
    res.json({
      status: 401,
      result: '当前用户不存在'
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

/****************************************************
 * 查询用户地址接口
 */
router.get('/addressList', function(req, res, next) {
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
        result: userDoc.addressList
      });
    }
  });
});

/**
 * 设置默认地址接口
 */
router.post('/setDefault', function(req, res, next) {
  let userId = req.cookies.userId;
  let addressId = req.body.addressId;

  Users.findOne({ userId }, function(error, userDoc) {
    if (error) {
      res.json({
        status: 500,
        msg: error.message
      });
    } else {
      userDoc.addressList.forEach(item => {
        (item.addressId === addressId)
        ? item.isDefault = true
        : item.isDefault = false;
      });
      userDoc.save(function(error, userDoc) {
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
    }
  });
});

/**
 * 删除地址接口
 */
router.post('/delAddress', function(req, res, next){
  let userId = req.cookies.userId;
  let addressId = req.body.addressId;
  // 数组修改器：向数组中删除指定元素
  Users.update({ userId }, { $pull: { 'addressList': { addressId } } }, function(error, useDoc) {
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
 * 创建订单功能
 */
router.post('/payMent', function(req, res, next) {
  let userId = req.cookies.userId;
  let addressId = req.body.addressId;
  let orderTotal = req.body.orderTotal;

  Users.findOne({ userId }, function(error, userDoc){
    if (error) {
      res.json({
        status: 500,
        msg: error.message
      })
    } else {
      let address = '';
      // 获取当前用户的地址信息
      userDoc.addressList.forEach(item => {
        (item.addressId === addressId)
          && (address = item);
      });
      //获取用户购物车的购买商品
      let goodsList = userDoc.cartList.filter(item => {
        return item.checked == '1';
      });

      // 创建订单 Id
      let platformCode = '852';
      let randomCode_1 = Math.floor(Math.random() * 10);
      let randomCode_2 = Math.floor(Math.random() * 10);
      let sysDate = new Date().Format('yyyyMMddhhmmss');  // 系统时间：年月日时分秒
      let orderId = platformCode + randomCode_1 + sysDate + randomCode_2;  // 21位

      // 订单创建时间
      let createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');

      // 订单
      let order = {
        orderId,         // 订单id
        orderTotal,      // 订单总金额(直接拿前端传过来的参数)
        address,         // 地址信息
        goodsList,       // 购买的商品信息
        createDate,      // 订单创建时间
        orderStatus: '1' // 订单状态，1 成功
      };
      // 订单信息存储到数据库
      userDoc.orderList.push(order);
      userDoc.save(function(error, userDoc) {
        if (error) {
          res.json({
            status: 500,
            msg: error.message
          });
        } else {
          res.json({
            status: 200,
            result: {
              orderId: order.orderId,
              orderTotal: order.orderTotal,
              createDate: order.createDate
            }
          });
        }
      });
    }
  });
});

/**
 * 根据订单 Id 查询订单信息
 */
router.get('/orderDetail', (req, res, next) => {
  let userId = req.cookies.userId;
  let orderId = req.query.orderId;

  Users.findOne({ userId }, function(error, userDoc) {
    if (error) {
      res.json({
        status: 500,
        msg: error.message
      });
    } else {
      let orderList = userDoc.orderList;
      if (orderList.length > 0) {
        let orderTotal = 0;
        orderList.forEach(item => {
          (item.orderId == orderId)
            && (orderTotal = item.orderTotal);
        });

        if (orderTotal > 0) {
          res.json({
            status: 200,
            result: {
              orderId: orderId,
              orderTotal: orderTotal
            }
          })
        } else {
          res.json({
            status: 2018,
            result: '无此订单'
          });
        }
      } else {
        res.json({
          status: 2019,
          result: '当前用户未创建订单'
        });
      }
    }
  });
});

module.exports = router;
