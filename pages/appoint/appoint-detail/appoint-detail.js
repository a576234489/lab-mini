// pages/appoint/appoint-detail/appoint-detail.js
import {fetchGetAppointDetail,fetchCancelAppoint} from '../../../service/appoint'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    appointData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      id: parseInt(options.id)
    })
    this.handleGetAppointDetail(options.id);
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
  handleCancleAppoint(){
    let data = {
      appointmentId: this.data.id,
      appointmentStatus: 4,
      userId: this.data.appointData.userId
    }
    console.log(data)
    fetchCancelAppoint(data).then(res => {
      if(res.code == 200){
        wx.navigateTo({
          url: '../appoint',
        })
      }else {
        wx.showToast({
          title: '取消预约失败',
          duration: 1000,
          icon: 'none'
        })
      }
    })
  }

})