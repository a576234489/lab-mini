// pages/maintain/chilCpns/maintain-equipment/maintain-equipment.js
const app = getApp();
const WxParse = require('../../../../wxParse/wxParse.js')
import {fetchGetDetail,fetchMaintainEquip,fetchMaintainEquipComplete,fetchGetMainTainList} from '../../../../service/equipment'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperCurrentIndex: 0,
    id: null,
    userInfo: null,
    equipment: null,
    btnStatus: null,
    equipmentMaintainDetails: null,
    presentationInfo: '',
    maintainList: null
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
    this.handleGetMainTainList();
  },
  handleGetDetail(){
    fetchGetDetail({equipmentId:this.data.id,userId:this.data.userInfo.id}).then(res => {
      console.log(res);
      let btnStatus;
      if(res.data.equipment.status == 3){
        btnStatus = 1;
      }else {
        btnStatus = 0;
      }
      this.setData({
        equipment: res.data.equipment,
        btnStatus,
        equipmentMaintainDetails: res.data.EquipmentMaintainDetails
      })
      const basicInfo = this.data.equipment.basicInfo ;
      const that = this;
      WxParse.wxParse('basicInfo', 'html', basicInfo, that,5);
    })
  },
  handleGetMainTainList() {
    fetchGetMainTainList({equipmentId: this.data.id}).then(res => {
      this.setData({
        maintainList: res.data
      })
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
  handleMaintainEquip(e){
    if(this.data.btnStatus == 0){
      wx.showModal({
        title: '提示',
        content: '确定要维修该设备?',
        success: res => {
          if(res.confirm) {
            let data = {maintainUserId: this.data.userInfo.userId,equipmentId: this.data.id};
            this.handleUpdateEquipStatus(data,1)
          }
        }
      })
    }else {
      wx.showModal({
        title: '提示',
        content: '确定维修完成?',
        success: res => {
          console.log(e);
          if(res.confirm){
            let data = {maintainUserId: this.data.userInfo.userId,equipmentId: this.data.id,
              maintainId: this.data.equipmentMaintainDetails.id,presentation: e.detail.value.presentation};
            fetchMaintainEquipComplete(data).then(res => {
              if(res.code == 200){
                this.handleGetDetail();
                this.handleGetMainTainList();
              }else {
                console.log(res);
                wx.showToast({
                  title: res.message,
                  icon: 'none',
                  duration: 1000
                })
              }
            })
          }
        }
      })
    }
  },
  handleUpdateEquipStatus(data,btnStatus){
    this.setData({
      presentationInfo: ''
    })
    fetchMaintainEquip(data).then(res => {
      if(res.code == 200){
        this.handleGetDetail();
        this.handleGetMainTainList();
      }else {
        console.log(res);
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  handleViewMainTainDetail(e){
    console.log(e);
    wx.navigateTo({
      url: '../maintain-detail/maintain-detail?id='+e.currentTarget.dataset.id,
    })
  }
})