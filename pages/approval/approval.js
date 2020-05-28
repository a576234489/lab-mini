// pages/approval/approval.js
const app = getApp();
import {fetchGetApproval} from '../../service/equipment.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperCurrentIndex: 0,
    userInfo: {},
    dataList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.handleGetUserInfo();
    this.handleGetApprovalData(1);
  },
  handleGetUserInfo(){
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },
  handleGetApprovalData(status) {
    let data = {
      admUserId: this.data.userInfo.userId,
      pageNum: 1,
      pageSize: 20,
      appointStatus: status
    }
    fetchGetApproval(data).then(res => {
      if(res.code == 200){
        this.setData({
          dataList: res.data.list
        })
      }else {
        wx.showToast({
          title: '加载数据失败',
          duration: 1000,
          icon: 'none'
        })
      }
      console.log(res);
    })
  },
  handleSwiperChange(e){
    console.log(e);
    let index = e.detail.current
    if(index == 0 || index == 1){
      this.handleGetApprovalData(parseInt(index) + 1)
    }else {
      this.handleGetApprovalData(parseInt(index) + 5)
    }
    setTimeout(() => {
      this.setData({
        swiperCurrentIndex: e.detail.current
       })
    }, 200);
    
  },
  handleTabClick(e){
    let index = e.currentTarget.dataset.index;
    if(index == this.data.swiperCurrentIndex){
      return;
    }
    if(index == 0 || index == 1){
      this.handleGetApprovalData(parseInt(index) + 1)
    }else {
      this.handleGetApprovalData(parseInt(index) + 5)
    }
    this.setData({
      swiperCurrentIndex: index
    })
  },
  handleApprovalDetail(e) {
    console.log(e);
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: './approval-detail/approval-detail?id='+id,
    })
  }
})