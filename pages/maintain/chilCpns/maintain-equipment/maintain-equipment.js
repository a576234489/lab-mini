// pages/maintain/chilCpns/maintain-equipment/maintain-equipment.js
const app = getApp();
const WxParse = require('../../../../wxParse/wxParse.js')
import {fetchGetDetail} from '../../../../service/equipment'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperCurrentIndex: 0,
    id: null,
    userInfo: null,
    equipment: null,
    btnStatus: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      id: options.id
    })
    this.handleGetUserInfo();
    this.handleGetDetail();
  },
  handleGetDetail(){
    fetchGetDetail({equipmentId:this.data.id,userId:this.data.userInfo.id}).then(res => {
      this.setData({
        equipment: res.data.equipment,
      })
      const basicInfo = this.data.equipment.basicInfo ;
      const that = this;
      WxParse.wxParse('basicInfo', 'html', basicInfo, that,5);
    })
  },
  handleSwiperChange(e){
    this.setData({
     swiperCurrentIndex: e.detail.current
    })
   },
  handleGetUserInfo(){
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },
  handleTabClick(e){
    let index = e.currentTarget.dataset.index;
    if(index == this.data.swiperCurrentIndex){
      return;
    }
    this.setData({
      swiperCurrentIndex: index
    })
  },
  handleMaintainEquip(){
    if(this.data.btnStatus == 0){
      this.setData({
        btnStatus: 1
      })
    }else {
      this.setData({
        btnStatus: 0
      })
    }
    
  }

})