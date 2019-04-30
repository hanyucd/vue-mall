let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// schema 会映射到 mongodb 中的一个 collection，它不具备操作数据库的能力
let productSchema = new Schema({
  "productId": String,
  "productName": String,
  "salePrice": Number,
  "productImage": String,
  "checked": String,
  "productNum": Number
});

// model 是由 Schema 生成的模型，可以对数据库的操作
module.exports = mongoose.model('Good', productSchema);