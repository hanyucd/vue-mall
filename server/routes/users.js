var express = require('express');
var Users = require('../models/users');
var router = express.Router();

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

module.exports = router;
