// pages/equipment-detail/equipment-detail.js
import {fetchGetDetail} from '../../service/equipment'
const WxParse = require('../../wxParse/wxParse.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    equipmentId: '',
    banners: [],
    equipment: {},
    equipmentStudyVideos: [],
    totalSwiper: null,
    currentSwiper: 1,
    buttonActiveIndex: 1,
    videoCoverIsShow: [],
    appointDialog: true,
    currentYear: null,
    currentMonth: null,
    weeks: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
    days: [],
    swiperDays: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      equipmentId: options.id
    })
    console.log(options)
    this.handleGetDetail();
    this.handleInitData();
  },
  handleGetDetail(){
    fetchGetDetail({equipmentId:this.data.equipmentId,userId:0}).then(res => {
      console.log(res);
      let banners = res.data.equipment.equipmentUrl.split(',')
      let videos = res.data.equipmentStudyVideos;
      let videoCoverIsShow = []
      videos.forEach(item => {
        videoCoverIsShow.push(true);
      })
      this.setData({
        banners: banners,
        equipment: res.data.equipment,
        totalSwiper: banners.length,
        equipmentStudyVideos: videos,
        videoCoverIsShow: videoCoverIsShow
      })
      const basicInfo = this.data.equipment.basicInfo ;
      const that = this;
      WxParse.wxParse('basicInfo', 'html', basicInfo, that,5);
      const operationManual =  this.data.equipment.operationManual;
      WxParse.wxParse('operationManual', 'html', operationManual, that,5);
    })
  },
  handleInitData(){
    let date = new Date()
    let currentDay = date.getDate();
    let currentMonth = date.getMonth() + 1;
    let currentYear = date.getFullYear();
    this.setData({
      currentMonth: currentMonth,
      currentYear: currentYear
    })
  },
  calculateDays(year, month, currentTag) {
    let daysTemp = [];
    const thisMonthDays = this.getThisMonthDays(year, month);
    for (let i = 1; i <= thisMonthDays; i++) {
      daysTemp.push({
        day: i,
        choosed: false
      });
    }
    let swiperDaysTemp = this.data.swiperDays;
    swiperDaysTemp[currentTag] = daysTemp;
    this.setData({
      days:daysTemp,
      swiperDays: swiperDaysTemp,
    });
  },
  // 计算每月有多少天
  getThisMonthDays(year, month) {
    return new Date(year, month, 0).getDate();
  },
  handleSwiperChange(event){
    this.setData({
      currentSwiper: event.detail.index + 1
    })
  },
  handleInfoOperationClick(event){
    console.log(this)
    this.setData({
      buttonActiveIndex: event.currentTarget.dataset.index
    });
  },
  handleplay(event){
    let index = event.target.dataset.index;
    let videoContext = wx.createVideoContext('video'+index);
    videoContext.play();
    let tempArray = this.data.videoCoverIsShow
    for(let i in tempArray){ 
      if(i == index){
        this.data.videoCoverIsShow.splice(i,1,false);
        break;
      } 
    } 
    this.setData({ 
      videoCoverIsShow: tempArray
    })
  },
  handleAppoint(){
    // console.log(app.globalData.userInfo);
    this.setData({
      appointDialog: true
    })
  }


})