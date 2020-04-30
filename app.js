//app.js
App({
  globalData:{
    userInfo: null,
    token: ''
  },
  onLaunch: function () {
    let userInfo = wx.getStorageSync('userInfo');
    let token = wx.getStorageSync('token')
    if(userInfo && token && token.length > 0){
      console.log('已经登陆过');
      wx.navigateTo({
        url: '/pages/index/index',
      })
    }else {
      console.log('去登录页')
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
 
})