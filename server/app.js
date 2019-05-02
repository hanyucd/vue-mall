var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var goodsRouter = require('./routes/goods');
var usersRouter = require('./routes/users');

var app = express();

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

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());	// 解析 application/json
app.use(bodyParser.urlencoded({ extended: false })); // 解析 application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname, 'public')));

/**
 * 捕获登录状态
 */
app.use(function(req, res, next) {
  if (req.cookies.userId) {
    next();
  } else {
    if (req.originalUrl === '/users/login' || req.originalUrl === 'users/logout' || req.originalUrl.indexOf('/goods/list') > -1) {
      next();
    } else {
      res.json({
        status: 401,
        result: '当前未登录'
      });
    }
  }
});

// 一级路由
app.use('/goods', goodsRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// 使用 nodemon 热更新
var debug = require('debug')('my-application'); // debug模块
app.set('port', process.env.PORT || 3000); // 设定监听端口

var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});

// module.exports = app;
