//index.js
//获取应用实例
const app = getApp()
import {
  fetchGetBanner,
  fetchGetNotice
} from '../../service/index.js'
import {
  fetchGetUserInfo
} from '../../service/login.js'
Page({
  data: {
    banners: [],
    notice: ""
  },
  onLoad: function(){
    this.handleGetBanner();
    this.handleGetNotice();
    this.wxLogin();
  },
  handleGetBanner(){
    fetchGetBanner().then(res => {
      console.log(res)
      if(res.code == 200){
        let banners = res.data.map(res => { return res.url})
        this.setData({
          banners: banners
        })
      }
    })
  },
  handleGetNotice(){
    fetchGetNotice().then(res => {
      if(res.code == 200){
        let notice = res.data.content;
        this.setData({
          notice: '公告：' + notice
        })
      }
    })
  },
  handleMaintain(){
    wx.navigateTo({
      url: '../../pages/maintain/maintain-list',
    })
  },
  wxLogin(){
    console.log('获取用户信息')
    wx.login({
      success:res => {
        fetchGetUserInfo(72).then(res => {
          if(res.code == 200){
            getApp().globalData.userInfo = res.data.userInfo;
            wx.setStorageSync('userInfo',res.data.userInfo);
          }
        })
      }
    })
  },
  handleGoAppoint(){
    wx.navigateTo({
      url: '../appoint/appoint',
    })
  },
  handleGoMainTainList(){
    wx.navigateTo({
      url: '../maintain/maintain-list',
    })
  }
  
})
