// pages/login/login.js
import {
  fetchLogin
} from '../../service/login.js'
Page({

  data: {

  },

  onLoad: function (options) {

  },
  loginFormSubmit(e){
    fetchLogin(e.detail.value.username,e.detail.value.password).then(res => {
      console.log(res)
      if(res.code == 200){
        if(res.data.userInfo && res.data.token && res.data.token.length > 0){
          getApp().globalData.userInfo = res.data.userInfo;
          getApp().globalData.token = res.data.token;
          wx.setStorageSync('userInfo',res.data.userInfo);
          wx.setStorageSync('token',res.data.token);
          wx.navigateTo({
            url: '/pages/index/index',
          })
        }else {
          wx.showToast({
            title: '登录异常',
            icon: 'none',
            duration: 2000
          })
        }
      }else {
        wx.showToast({
          title: '账号名或密码错误',
          icon: 'none',
          duration: 2000
        })
      }
    })
  }
})