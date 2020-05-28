// pages/result/appointApproval/appointApprovalResult.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0
  },
  handleGoIndex(){
    wx.redirectTo({
      url: '/pages/index/index',
    })
  },
  handleGoAppoint(){
    wx.redirectTo({
      url: '/pages/index/index',
    })
  }

})