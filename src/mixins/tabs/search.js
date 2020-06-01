import wepy from 'wepy'

export default class extends wepy.mixin {
  data = {
    value: '',
    suggestList: [],
    // keyWork关键词的列表 
    kwList: []
  }
  onLoad() {
    // 调用小程序官方提供的 getStorageSync 函数，可以从本地存储中读取数据
    const kwList = wx.getStorageSync('kw') || []
    // 将读取的数据挂载到 data 中
    this.kwList = kwList
  }
  computed = {
    isHistoryShow() {
      if (this.value === '') {
        return true
      } else {
        return false
      }
    }
  }
  methods = {
    onSearch(event) {
      console.log('触发了search事件');
      console.log(event.detail);
      const kw = event.detail.trim()
      if (kw.length <= 0) {
        this.value = ''
        return
      }
      // 判断数组里面没有重复的元素
      if (this.kwList.indexOf(kw) === -1) {
        this.kwList.unshift(kw)
      }
      this.kwList = this.kwList.slice(0, 10)
      wepy.setStorageSync('kw', this.kwList)
      wepy.navigateTo({
        // 导航进入商品列表页面
        url: '/pages/goods_list/index?query=' + kw
      })
    },
    onCancel() {
      this.value = ''
      this.suggestList = []
    },
    onChange(event) {
      console.log('触发了change事件');
      console.log(event.detail);
      if (event.detail.trim().length <= 0) {
        this.value = ''
        this.suggestList = []
        return
      }
      this.value = event.detail.trim()
      this.getSuggestList(event.detail)
    },
    // 点击搜索建议项，导航到商品详情页面
    goGoodsDetail(goods_id) {
      wepy.navigateTo({
        url: '/pages/goods_detail/main?goods_id=' + goods_id
      })
    },
    // 点击历史记录进入商品列表页面
    goGoodsList(query) {
      wepy.navigateTo({
        url: '/pages/goods_list/index?query=' + query
      })
    },
    // 清空历史列表页面
    clearHistory() {
      this.kwList = []
      wepy.setStorageSync('kw', [])
    }
  }
  // 获取搜索建议列表
  async getSuggestList(searchStr) {
    const { data: res } = await wepy.get('goods/qsearch', { query: searchStr })
    if (res.meta.status !== 200) {
      return wepy.baseToast()
    }
    this.suggestList = res.message
    this.$apply()
  }
}