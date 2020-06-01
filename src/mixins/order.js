import wepy from 'wepy'

export default class extends wepy.mixin {
  data = {
    // 收货地址
    addressInfo: null,
    // 购物车页面勾选的商品列表，通过筛选数组得到
    cart: [],
    // 是否登录成功了
    islogin: false
  }
  onLoad() {
    // 读取收货地址
    this.addressInfo = wepy.getStorageSync('address') || null
    const newArr = this.$parent.globalData.cart.filter(item => item.isCheck)
    this.cart = newArr
    console.log(this.cart)
  }
  computed = {
    // 判断是否添加了地址信息
    isHaveAddress() {
      if (this.addressInfo === null) {
        return false
      }
      return true
    },
    // 点击选择收货地址
    addressStr() {
      if (this.addressInfo === null) {
        return '请选择收货地址'
      }
      const addr = this.addressInfo
      const str =
        addr.provinceName + addr.cityName + addr.countyName + addr.detailInfo
      return str
    }
  }
  methods = {
    async chooseAddress() {
      const res = await wepy.chooseAddress().catch(err => err)
      if (res.errMsg !== 'chooseAddress:ok') {
        return
      }
      this.addressInfo = res
      wepy.setStorageSync('address', res)
      this.$apply()
      console.log(res);
    },
    // 获取用户信息
    async getUserInfo(userInfo) {
      // 判断是否获取用户信息失败
      if (userInfo.detail.errMsg !== 'getUserInfo:ok') {
        return wepy.baseToast('获取用户信息失败')
      }
      // userInfo为事件对象，和event一样
      console.log(userInfo)

      // 获取用户登录的凭证Code
      const loginRes = await wepy.login()
      console.log(loginRes);
      if (loginRes.errMsg !== 'login:ok') {
        return wepy.baseToast('微信登录失败！')
      }

      // 登录的参数
      const loginParams = {
        code: loginRes.code,
        encryptedData: userInfo.detail.encryptedData,
        iv: userInfo.detail.iv,
        rawData: userInfo.detail.rawData,
        signature: userInfo.detail.signature
      }
      // 发起登录请求之后的token字符串，保存到Storage中
      const { data: res } = await wepy.post('/users/wxlogin', loginParams)
      console.log(res)
      if (res.meta.status !== 200) {
        return wepy.baseToast('微信登录失败！')
      }
      // 把登录成功之后的 Token 字符串，保存到 Storage 中
      wepy.setStorageSync('token', res.message.token)
      this.islogin = true
      this.$apply()
    }
  }
}