import wepy from 'wepy'

export default class extends wepy.mixin {
  data = {
    query: '',
    cid: '',
    pagenum: 1,
    pagesize: 10,
    // 商品列表数据
    goodslist: [],
    // 获取到的商品条数
    total: 0,
    // 判断是否加载完毕，是布尔值，默认是false
    isover: false,
    // 表示当前数据是否正在请求中
    isloading: false
  }
  methods = {
    // 点击商品列表页面进入商品详情页面
    goGoodsDetail(goods_id) {
      wepy.navigateTo({
        url: '/pages/goods_detail/main?goods_id=' + goods_id
      })
    }
  }
  onLoad(options) {
    console.log(options)
    // 进行非法时的校验
    this.query = options.query || ''
    this.cid = options.cid || ''
    this.getGoodsList()
  }
  async getGoodsList(callback) {
    // 数据将要发送请求时，将isloading重置为true
    this.isloading = true
    const { data: res } = await wepy.get('goods/search', {
      query: this.query,
      cid: this.cid,
      pagenum: this.pagenum,
      pagesize: this.pagesize
    })
    if (res.meta.status !== 200) {
      return wepy.baseToast()
    }
    // 新旧数据拼接合并，通过展开运算符，加载更多页面的数据
    this.goodslist = [...this.goodslist, ...res.message.goods]
    this.total = res.message.total
    // 当数据请求完成后，将 isloading 重置为 false
    this.isloading = false
    this.$apply()
    // 数据请求成功，立即关闭刷新成功
    // wepy.stopPullDownRefresh() 用回调函数
    callback && callback()
    console.log(res);
    console.log(this.goodslist);
    console.log(this.total);
  }
  // 触底操作
  onReachBottom() {
    // 判断现在是否正在发起数据请求
    if (this.isloading) {
      return
    }
    // 判断是否已经是最后一页
    if (this.pagenum * this.pagesize >= this.total) {
      this.isover = true
      return
    }
    console.log('触底了')
    // 页面数量加1，再次请求加载
    this.pagenum++
    this.getGoodsList()
  }
  // 下拉刷新的操作
  onPullDownRefresh() {
    // 初始化必要的字段值
    this.pagenum = 1
    this.total = 0
    this.goodslist = []
    this.isover = this.isloading = false
    // 重新发送数据请求
    // this.getGoodsList()  优化
    this.getGoodsList(() => {
      wepy.stopPullDownRefresh()
    })
  }
}