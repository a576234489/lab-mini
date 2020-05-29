// pages/result/appointApproval/appointApprovalResult.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    //预约id
    id: null
  },
  onLoad(options){
    this.setData({
      id: parseInt(options.id)
    })
  },
  handleGoIndex(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  handleGoAppoint(){
    wx.redirectTo({
      url: '/pages/appoint/appoint-detail/appoint-detail?id=' + this.data.id,
    })
  }

})