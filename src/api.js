import wepy from 'wepy'
var baseURL = 'https://api.zbztb.cn/api/public/v1/'

wepy.baseToast = function () {
  wepy.showToast({
    title: '请求数据失败',
    icon: 'none',
    duration: 1000
  })
}

wepy.get = function (url, data = {}) {
  return wepy.request({
    url: baseURL + url,
    method: 'get',
    data: data
  })
}


wepy.post = function (url, data = {}) {
  return wepy.request({
    url: baseURL + url,
    method: 'post',
    data: data
  })
}
