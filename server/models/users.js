let mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
  userId: String,
  userName: String,
  userPwd: String,
  orderList: Array,
  cartList: [
    {
      productId: String,
      productName: String,
      salePrice: String,
      productImage: String,
      checked: String, // 是否选中
      productNum: String // 商品数量
    }
  ],
  addressList: Array
});

module.exports = mongoose.model('User', userSchema);