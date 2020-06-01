import wepy from 'wepy'

export default class extends wepy.mixin {
  data = {
    // 商品的id值
    goods_id: '',
    // 商品的详情
    goodsInfo: {},
    // 收货地址
    addressInfo: null
  }
  methods = {
    // 点击预览图片
    preview(current) {
      wepy.previewImage({
        // 所有图片的路径  循环得到每一项，每一项下面的pics_big属性得到一个新数组
        urls: this.goodsInfo.pics.map(item => item.pics_big),
        // 当前默认看到的图片
        current: current
      })
    },
    // 获取用户的收货地址
    async chooseAddress() {
      // 官方api接口
      const res = await wepy.chooseAddress().catch(err => err)

      if (res.errMsg !== 'chooseAddress:ok') {
        return wepy.baseToast('获取收货地址失败！')
      }

      this.addressInfo = res
      // 将选择的收获地址，存储到本地 Storage 中
      wepy.setStorageSync('address', res)
      this.$apply()
    },
    // 点击按钮，把商品添加到购物车列表中
    addToCart() {
      // 获取到当前商品的所有信息
      // console.log(this.goodsInfo)
      // 提示用户加入购物车成功
      // console.log(this.$parent.globalData)
      // console.log(this.$parent)
      // 通过this.$parent 全局共享的数据
      this.$parent.addGoodsToCart(this.goodsInfo)
      wepy.showToast({
        title: '已加入购物车',
        icon: 'success'
      })
    }
  }
  computed = {
    // 点击选择收货地址
    addressStr() {
      if (this.addressInfo === null) {
        return '请选择收货地址'
      }
      const addr = this.addressInfo
      const str =
        addr.provinceName + addr.cityName + addr.countyName + addr.detailInfo
      return str
    },
    // 商品详情页面调用全局函数，显示已经勾选的商品数量
    total() {
      return this.$parent.globalData.total
    }
  }
  onLoad(options) {
    // 加载页面获取到从其他页面传递过来的数据
    console.log(options)
    // 转存商品Id
    this.goods_id = options.goods_id
    // 发起数据请求
    this.getGoodsInfo()
  }
  async getGoodsInfo() {
    const { data: res } = await wepy.get('goods/detail', {
      goods_id: this.goods_id
    })
    if (res.meta.status !== 200) {
      return wepy.baseToast()
    }
    this.goodsInfo = res.message
    // 通知页面，data中数据发生了变化，需要强制页面重新渲染一次
    this.$apply()
    console.log(this.goodsInfo)
  }
}