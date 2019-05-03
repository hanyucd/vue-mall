
const mutations = {
  updateUserInfo(state, nickName) {
    state.nickName = nickName;
  },
  initCartCount(state, cartCount) {
    state.cartCount = cartCount;
  },
  updateCartCount(state, cartCount) {
    state.cartCount += cartCount;
  }
};

export default mutations;