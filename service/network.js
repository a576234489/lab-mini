import {
  baseUrl,
  timeout
} from './config.js'
function request(options){
  wx.showLoading({
    title: '数据加载中ing',
  })
  return new Promise((resolve,reject) => {
    wx.request({
      url: baseUrl + options.url,
      timeout: timeout,
      method: options.method,
      //当后台接收参数处理方式为@requestParam,请求又为post请求,请求头接收方式如下
      header:{
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"
      },
      data: options.data,
      success: res => {
        resolve(res.data)
      },
      fail: reject,
      complete: res => {
        wx.hideLoading();
      }
    })
  })
}
export default request;