// pages/equipment-detail/equipment-detail.js
import {fetchGetDetail} from '../../service/equipment'
const WxParse = require('../../wxParse/wxParse.js')
const app = getApp();
let topCurrent = 1;
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
    swiperDays: [],
    swiperEmpty: [],
    hasEmptyGrid: false,
    currentId: 1
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
    let currentYear = date.getFullYear();
    let currentMonth = date.getMonth() + 1;
    let currentDay = date.getDate();
    
    let bottomYear = currentYear;
    let bottomMonth = currentMonth;
    
    let topYear = currentYear;
    let topMonth = currentMonth;
    if(currentMonth == 1){
      bottomMonth = 12;
      bottomYear--;
    }else {
      bottomMonth--; 
    }
    if(currentMonth == 12){
      topMonth = 1;
      topYear++;
    }else {
      topMonth++;
    }
    this.handleCalcuEmptyDaysOfmonth(bottomYear,bottomMonth,0);
    this.handleCalculateDays(bottomYear,bottomMonth,0);
    this.handleCalcuEmptyDaysOfmonth(currentYear,currentMonth,1);
    this.handleCalculateDays(currentYear,currentMonth,1);
    this.handleCalcuEmptyDaysOfmonth(topYear,topMonth,2);
    this.handleCalculateDays(topYear,topMonth,2);
    this.setData({
      currentMonth: currentMonth,
      currentYear: currentYear
    })
    console.log(this.data.days,this.data.swiperDays,this.data.swiperEmpty)
  },
  //日历滚动后触发事件
  handleDataSwiperChange(event){
    let currentYear = this.data.currentYear;
    let currentMonth = this.data.currentMonth;
    let newCurrent = event.detail.current;
    let nextCurrent;
    //右边滑动 月份减1
    console.log(newCurrent,topCurrent);
    if(newCurrent == 2){
      if(topCurrent == 0){
        nextCurrent = 1;
        if(currentMonth < 2){
          currentMonth = 12;
          currentYear--;
        }else {
          currentMonth--;
        }
        this.handlePreNextData(currentYear, currentMonth, 1, nextCurrent)
      }else {
        nextCurrent = 0;
        if(currentMonth < 2){
          currentMonth = 12;
          currentYear--;
        }else {
          currentMonth--;
        }
        this.handlePreNextData(currentYear, currentMonth, 0, nextCurrent)
      }
    }else if(newCurrent==1){
      if (topCurrent == 2) {     //右滑  月份减一
        nextCurrent = 0
        if (currentMonth < 2) {
          currentMonth = 12;
          currentYear--;
        } else {
          currentMonth--;
        }
        this.handlePreNextData(currentYear, currentMonth, 1, nextCurrent)
      } else {                  //左滑  月份加一
        nextCurrent = 2
        if (currentMonth == 12) {
          currentMonth = 1;
          currentYear++;
        } else {
          currentMonth++;
        }
        this.handlePreNextData(currentYear, currentMonth, 0, nextCurrent)
      }
    }else{
        if (topCurrent == 1) {     //右滑  月份减一
          currentMonth = 2
          if (currentMonth < 2) {
            currentMonth = 12;
            currentYear--;
          } else {
            currentMonth--;
          }
          this.handlePreNextData(currentYear, currentMonth, 1, nextCurrent)
        } else {                  //左滑  月份加一
          nextCurrent = 1
          if (currentMonth == 12) {
            currentMonth = 1;
            currentYear++;
          } else {
            currentMonth++;
          }
          this.handlePreNextData(currentYear, currentMonth, 0, nextCurrent)
        }
      }
    topCurrent = newCurrent;
    this.setData({
      currentYear,
      currentMonth,
      currentId: newCurrent,
    })
  },
  //预加载下个月的数据
  handlePreNextData(currentYear,currentMonth,type,nextCurrent){
    if(type == 0){
      if(currentMonth == 12){
        currentMonth = 1;
        currentYear++;
      }else {
        currentMonth++;
      }
    }else {
      if(currentMonth < 2){
        currentMonth = 12;
        currentYear--;
      }else {
        currentMonth--;
      }
    }
    console.log("当前预加载：" + currentYear + "月" + currentMonth + "日" + nextCurrent+"下标")
    this.handleCalcuEmptyDaysOfmonth(currentYear, currentMonth, nextCurrent);
    this.handleCalculateDays(currentYear, currentMonth, nextCurrent);
  },
  //存储每月的天数
  handleCalculateDays(year, month, currentTag) {
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
  // 计算在每月第一天在当月第一周之前的空余的天数
  handleCalcuEmptyDaysOfmonth(year,month,currentTag){
    const firstDayOfWeek = this.getFirstDayOfWeek(year,month);
    let swiperEmpty = this.data.swiperEmpty;
    let emptyGrids = [];
    if(firstDayOfWeek > 0) {
      for(let i = 0; i < firstDayOfWeek; i++){
        emptyGrids.push(i);
      }
      swiperEmpty[currentTag] = emptyGrids;
      this.setData({
        hasEmptyGrid: true,
        emptyGrids,
        swiperEmpty
      })
    }else {
      swiperEmpty[currentTag] = [];
      this.setData({
        hasEmptyGrid: true,
        emptyGrids,
        swiperEmpty
      })
    }
  },
  // 计算每月第一天是星期几
  getFirstDayOfWeek(year,month){
    return new Date(Date.UTC(year,month - 1,1)).getDay();
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