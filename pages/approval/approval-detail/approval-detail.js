// pages/approval/approval-detail/approval-detail.js
import {fetchGetAppointDetail,fetchUpdateAppointStatus} from '../../../service/appoint'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    appointData: null,
    userInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: parseInt(options.id)
    })
    this.handleGetUserInfo()
    this.handleGetAppointDetail(options.id);
  },
  handleGetUserInfo(){
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },
  handleGetAppointDetail(id) {
    let data = {appointmentId:id}
    fetchGetAppointDetail(data).then(res => {
      if(res.code == 200){
        this.setData({
          appointData: res.data
        })
      }else {
        wx.showToast({
          title: '加载数据失败',
          duration: 1000,
          icon: 'none'
        })
      }
    })
  },
  handleUpdateAppointStatus(e){
    let status = e.currentTarget.dataset.status;
    let tip = '';
    if(status == 2){
      tip = '确认审核通过?'
    }else if(status == 7){
      tip = '确认审核拒绝?'
    }else if(status == 6){
      tip = '确认已上级?'
    }
    wx.showModal({
      title: '提示',
      content: tip,
      success: res => {
        if(res.confirm){
          let data = {
            appointmentId: this.data.id,
            appointmentStatus: status,
            userId: this.data.userInfo.userId
          }
          fetchUpdateAppointStatus(data).then(res => {
            if(res.code == 200){
              wx.navigateTo({
                url: '../approval',
              })
            }else {
              wx.showToast({
                title: res.message,
                duration: 1000,
                icon: 'none'
              })            
            }
          })
        }
      }
    })
  }
})