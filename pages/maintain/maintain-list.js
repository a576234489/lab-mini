// pages/maintain/maintain-list.js
import {fetchGetMyMainTainList} from '../../service/equipment'
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
    this.handleGetMyMainTainList("");
  },

  handleGetUserInfo(){
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },
  handleGetMyMainTainList(val){
    let data = {pageNum: 1,pageSize: 10,userId: this.data.userInfo.userId,searStr: val};
    fetchGetMyMainTainList(data).then(res => {
      this.setData({
        dataList: res.data.list
      })
    })
  },
  handleSearch(e){
    this.handleGetMyMainTainList(e.detail.value)
  },
  handleMainTainEquipmentClick(e){
    wx.navigateTo({
      url: './chilCpns/maintain-equipment/maintain-equipment?id='+e.currentTarget.dataset.id,
    })
  }
})