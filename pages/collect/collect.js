// pages/collect/collect.js
const app = getApp();
import {fetchGetCollectList} from '../../service/equipment'
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  onLoad(){
    this.handleGetUserInfo();
    this.handleGetCollectList("");
  },
  handleGetUserInfo(){
    this.setData({
      userInfo: app.globalData.userInfo,
      dataList: null
    })
  },
  handleGetCollectList(val){
    let data = {pageNum: 1,pageSize: 10,userId: this.data.userInfo.userId,screStr: val};
    fetchGetCollectList(data).then(res => {
      this.setData({
        dataList: res.data.list
      })
    })
  },
  handleCollectEquipmentClick(e){
    console.log(e);
    wx.navigateTo({
      url: '../equipment-detail/equipment-detail?id='+e.currentTarget.dataset.id,
    })
  },
  handleSearch(e){
    this.handleGetCollectList(e.detail.value)
  },
})