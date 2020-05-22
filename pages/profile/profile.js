// pages/profile/profile.js
const app = getApp();
Page({

  data: {
    userInfo: null
  },
  onLoad(){
    this.handleGetUserInfo();
  },
  handleGetUserInfo(){
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },
  handleShowPersonInfo(){
    wx.navigateTo({
      url: './childCpns/personInfo/person-info',
    })
  },
  handleShowMyAppoint(){
    wx.navigateTo({
      url: '/pages/appoint/appoint',
    })
  }
})