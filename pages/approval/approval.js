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
    status: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.handleGetUserInfo();
    // this.handleGetApprovalData(1);
  },
  onShow(){
    this.handleGetUserInfo();
    this.handleGetApprovalData(this.data.status);
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
    let status;
    if(index == 0 || index == 1){
      status = parseInt(index) + 1
      this.handleGetApprovalData(status)
    }else {
      status =parseInt(index) + 5
      this.handleGetApprovalData(status)
    }
    setTimeout(() => {
      this.setData({
        swiperCurrentIndex: e.detail.current,
        status
       })
    }, 200);
    
  },
  handleTabClick(e){
    let index = e.currentTarget.dataset.index;
    let status;
    if(index == this.data.swiperCurrentIndex){
      return;
    }
    if(index == 0 || index == 1){
      status = parseInt(index) + 1;
      this.handleGetApprovalData(parseInt(index) + 1)
    }else {
      status = parseInt(index) + 5;
      this.handleGetApprovalData(parseInt(index) + 5)
    }
    this.setData({
      swiperCurrentIndex: index,
      status
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