// pages/profile/childCpns/personInfo/person-info.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
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

})