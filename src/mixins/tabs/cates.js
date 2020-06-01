import wepy from 'wepy'

export default class extends wepy.mixin {
  data = {
    // 请求到的所有数据
    cateList: [],
    active: 0,
    // 当前屏幕的可用高度
    wh: 0,
    // 分类项的二级数据项
    secondCate: [],
    scrollTop: 0
  }
  onLoad() {
    this.getCatesData()
    // 动态获取屏幕可用的高度
    this.getWindowHeight()
  }
  // 获取列表数据的函数
  async getCatesData() {
    const { data: res } = await wepy.get('categories')
    if (res.meta.status !== 200) {
      return wepy.baseToast()
    }
    console.log(res.message)
    this.cateList = res.message
    this.secondCate = this.cateList[0].children
    this.$apply()
  }

  // 动态获取屏幕可用的高度
  async getWindowHeight() {
    // wx的函数都可以用wepy来代替
    const res = await wepy.getSystemInfo()
    if (res.errMsg === 'getSystemInfo:ok') {
      // 返回的数据wh为页面的可用高度
      this.wh = res.windowHeight
      this.$apply()
    }
  }
  methods = {
    // 事件函数点击事件
    onChange(event) {
      // event.detail为点击项的索引
      // console.log(event.detail)
      this.secondCate = this.cateList[event.detail].children
      // 每一次的高度scrollTop数值都应该不一样，那样点击才会发生变化
      this.scrollTop = this.scrollTop - 1
      console.log(this.secondCate)
    },
    // 事件函数点击事件
    goGoodsList(url) {
      console.log('点击图片进入详情页面')
      wepy.navigateTo({
        url: url
      })
    }
  }
}