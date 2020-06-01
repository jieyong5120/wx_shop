import wepy from 'wepy'

export default class extends wepy.mixin {
  data = {
    swiperList: [],
    cateItems: [],
    floorData: []
  }
  onLoad() {
    // 后台获取到的轮播图数据
    this.getSwiperData()
    this.getCateItems()
    // 在页面加载完成后，自动获取楼层数据
    this.getFloorData()
  }
  methods = {
    // 事件函数点击事件
    goGoodsList(url) {
      console.log('点击图片进入详情页面')
      wepy.navigateTo({
        url: url
      })
    }
  }
  // 获取轮播图数据的函数
  async getSwiperData() {
    const { data: res } = await wepy.get('home/swiperdata')
    if (res.meta.status !== 200) {
      return wepy.baseToast()
    }
    // console.log(res.message)
    this.swiperList = res.message
    this.$apply()
  }
  // 获取首页分类相关的数据项
  async getCateItems() {
    const { data: res } = await wepy.get('home/catitems')
    if (res.meta.status !== 200) {
      return wepy.baseToast()
    }
    this.cateItems = res.message
    this.$apply()
  }
  // 获取楼层相关的数据
  async getFloorData() {
    const { data: res } = await wepy.get('home/floordata')
    if (res.meta.status !== 200) {
      return wepy.baseToast()
    }

    this.floorData = res.message
    console.log(res.message)
    // 通知页面，data中数据发生了变化，需要强制页面重新渲染一次
    this.$apply()
  }
}