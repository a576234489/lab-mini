// pages/appoint/appoint.js
const app = getApp();
import {fetchGetAppoint} from '../../service/appoint.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperCurrentIndex: 0,
    userInfo: {},
    dataList: [],
  },
  onLoad() {
    this.handleGetUserInfo();
    this.handleGetAppointData(1);
  },
  handleGetUserInfo(){
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },
  handleGetAppointData(status) {
    let data = {
      userId: this.data.userInfo.userId,
      pageNum: 1,
      pageSize: 20,
      status
    }
    fetchGetAppoint(data).then(res => {
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
   this.setData({
    swiperCurrentIndex: e.detail.current
   })
  },
  handleTabClick(e){
    let index = e.currentTarget.dataset.index;
    if(index == this.data.swiperCurrentIndex){
      return;
    }
    this.handleGetAppointData(parseInt(index) + 1)
    this.setData({
      swiperCurrentIndex: index
    })
  },
  handleAppointDetail(e) {
    console.log(e);
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: './appoint-detail/appoint-detail?id='+id,
    })
  }
})