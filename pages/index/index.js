//index.js
//获取应用实例
const app = getApp()
const {formatTimeStrToDate,caclDateReduce} = require('../../utils/util.js') 
import {
  fetchGetBanner,
  fetchGetNotice,
  fetchGetCountdown
} from '../../service/index.js'
import {
  fetchGetUserInfo
} from '../../service/login.js'
Page({
  data: {
    banners: [],
    notice: "",
    userInfo: null,
    //第一个要做实验的设备
    appointEquip: null,
    day: null,
    hour: null,
    min: null,
    second: null,
  },
  onLoad: function(){
    this.wxLogin();
    this.handleGetBanner();
    this.handleGetNotice();
    //获取首页倒计时
    this.handleGetCountdown();
  },
  handleGetCountdown() {
    fetchGetCountdown({userId: this.data.userInfo.userId}).then(res => {
      if(res.data.length > 0){
        let timeStr = res.data[0].startTime;
        let dateEnd = formatTimeStrToDate(timeStr);
        let retValue = caclDateReduce(new Date(),dateEnd);
        this.setData({
          appointEquip: res.data[0],
          day: retValue.Days,
          hour: retValue.Hours,
          min: retValue.Minutes,
          second: retValue.Seconds
        })
        setInterval(()=>{
          let second = this.data.second;
          let min = this.data.min;
          let hour = this.data.hour;
          let day = this.data.day;
          if(second == 0){
            second = 60
            if(min == 0){
              min = 60;
              if(hour == 0){
                hour = 24
                if(day == 0){
                  second = 0;
                  min = 0;
                  hour = 0
                  this.handleGetCountdown();
                }else {
                  day--
                }
              }else {
                hour--;
              }
            }else {
              min--;
            }
          }else {
            second--;
          };
          this.setData({
            day,
            hour,
            min,
            second
          })
        },1000);
      }
    })
  },
  handleGetBanner(){
    fetchGetBanner().then(res => {
      console.log(res)
      if(res.code == 200){
        let banners = res.data.map(res => { return res.url})
        this.setData({
          banners: banners
        })
      }
    })
  },
  handleGetNotice(){
    fetchGetNotice().then(res => {
      if(res.code == 200){
        let notice = res.data.content;
        this.setData({
          notice: '公告：' + notice
        })
      }
    })
  },
  wxLogin(){
    if(!app.globalData.userInfo){
      wx.login({
        success:res => {
          fetchGetUserInfo(72).then(res => {
            if(res.code == 200){
              getApp().globalData.userInfo = res.data.userInfo;
              wx.setStorageSync('userInfo',res.data.userInfo);
            }
          })
        }
      })
    }
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },
  handleGoAppoint(){
    wx.navigateTo({
      url: '../appoint/appoint',
    })
  },
  handleGoMainTainList(){
    wx.navigateTo({
      url: '../maintain/maintain-list',
    })
  },
  handleGoCollectList() {
    wx.navigateTo({
      url: '../collect/collect',
    })
  },
  handleGoApprovalList() {
    wx.navigateTo({
      url: '../approval/approval',
    })
  },
  handleViewEquip(e){
    console.log(e);
    wx.navigateTo({
      url: '../approval/approval-detail/approval-detail?id=' + e.currentTarget.dataset.id,
    })
  }
  
})
