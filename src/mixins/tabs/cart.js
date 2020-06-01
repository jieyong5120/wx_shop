import wepy from 'wepy'

export default class extends wepy.mixin {
  data = {
    cart: []
  }
  onLoad() {
    this.cart = this.$parent.globalData.cart
  }
  methods = {
    // 通过事件对象event可以获得步进器传递的信息
    countChanged(event) {
      console.log(event)
      // 获取到变化之后最新的数量值
      const count = event.detail
      // 商品的Id值，就是通过步进器传递过来的id
      const id = event.target.dataset.id
      this.$parent.updateGoodsCount(id, count)
    },
    // 点击复选框的事件函数
    statusChanged(event) {
      // 当前的选中的状态
      const status = event.detail
      // 商品的Id值，就是通过步进器传递过来的id
      const id = event.target.dataset.id
      this.$parent.updateGoodsStatus(id, status)
    },
    // 滑动单元格显示删除，点击删除事件函数
    close(id) {
      this.$parent.removeGoodsById(id)
    },
    // 点击全选按钮更新所有商品的选中状态
    onFullCheckChanged(event) {
      this.$parent.updateAllGoodsStatus(event.detail)
    },
    // 提交购物车页面表单，跳转页面
    submitOrder() {
      if (this.amount <= 0) {
        return wepy.baseToast('订单金额不能为空！')
      }
      wepy.navigateTo({
        url: '/pages/order'
      })
    }
  }
  // 计算属性
  computed = {
    // 判断购物车是否为空
    isEmpty() {
      if (this.cart.length <= 0) {
        return true
      }
      return false
    },
    // 总价格单位是分
    amount() {
      // 总价格单位是元
      let total = 0
      this.cart.forEach(item => {
        if (item.isCheck) {
          total += item.price * item.count
        }
      })
      // 把总价格转化为单位分
      return total * 100
    },
    // 判断全选的计算属性
    isFullChecked() {
      const allCount = this.cart.length
      let sonCount = 0
      this.cart.forEach(item => {
        if (item.isCheck) {
          // 循环遍历商品被选中的数量
          sonCount++
        }
      })
      return allCount === sonCount
    }
  }
}