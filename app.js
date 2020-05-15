//app.js
import {
  fetchGetUserInfo
} from './service/login.js'
App({
  globalData:{
    userInfo: null,
  },
  onLaunch: function () {
    let userInfo = wx.getStorageSync('userInfo');
    // let token = wx.getStorageSync('token')
    if(userInfo){
      console.log('已经登陆过');
      this.globalData.userInfo = userInfo;
      wx.navigateTo({
        url: '/pages/index/index',
      })
    }else {
      // console.log('去登录页')
      // wx.navigateTo({
      //   url: '/pages/login/login',
      // })
      this.wxLogin();
    } 
  },
  wxLogin(){
    console.log('获取用户信息')
    wx.login({
      success:res => {
        fetchGetUserInfo(57).then(res => {
          if(res.code == 200){
            getApp().globalData.userInfo = res.data.userInfo;
            wx.setStorageSync('userInfo',res.data.userInfo);
          }
        })
      }
    })
  }
 
})