// pages/equipment-detail/equipment-detail.js
import {fetchGetDetail} from '../../service/equipment'
const WxParse = require('../../wxParse/wxParse.js')
const app = getApp();
//轮播图上一级索引
var topCurrentId = 1
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
    currentDay: null,
    chooseYear: null,
    chooseMonth: null,
    chooseDay: null,
    weeks: ['SUN','MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
    days: [],
    swiperDays: [],
    swiperEmpty: [],
    //swiper组件高度
    swiperHeight:0,
    hasEmptyGrid: false,
    //日期轮播图当前索引
    currentId: 1,
    timeSelectorDialog: true
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
    if(currentMonth == 12){
      bottomMonth = 1;
      bottomYear++;
    }else {
      bottomMonth++; 
    }
    if(currentMonth == 1){
      topMonth = 12;
      topYear--;
    }else {
      topMonth++;
    }
    this.handleCalcuEmptyDaysOfmonth(topYear,topMonth,0);
    this.handleCalculateDays(topYear,topMonth,0);
    this.handleCalcuEmptyDaysOfmonth(currentYear,currentMonth,1);
    this.handleCalculateDays(currentYear,currentMonth,1);
    this.handleCalcuEmptyDaysOfmonth(bottomYear,bottomMonth,2);
    this.handleCalculateDays(bottomYear,bottomMonth,2);
    this.setData({
      currentMonth: currentMonth,
      currentYear: currentYear,
      currentDay: currentDay
    })
    this.handleSwiperDataHeight(this.data.swiperEmpty[this.data.currentId],this.data.swiperDays[this.data.currentId]);
    this.handleChooseYearMonth();
  },
  handleSwiperDataHeight(swiperEmpty,swiperDays){
    let length = swiperEmpty.length + swiperDays.length;
    let swiperHeight = (Math.ceil(length/7))*82 + 30;
    this.setData({
      swiperHeight: swiperHeight
    })
    console.log(swiperHeight);
  },
  //日历滚动后触发事件
  handleDataSwiperChange(event){
    let newCurrent = event.detail.current;
    console.log(newCurrent);
    this.handleDataSwiperChangeDetail(newCurrent);
  },
  handleDataSwiperChangeDetail(newCurrent){
    let currentYear = this.data.currentYear;
    let currentMonth = this.data.currentMonth;
    console.log(currentYear,currentMonth);
    let changeTag;
    console.log(newCurrent,topCurrentId)
    let newTimeObj = {};
    if(newCurrent == 2){
      if(topCurrentId == 0){//向右滑动  月份减一 0->2
        changeTag = 1;
        let {currentYearTemp,currentMonthTemp} = this.handleCalcuYearMonthReduce(currentYear,currentMonth)
        newTimeObj = {currentYearTemp,currentMonthTemp};
        this.handlePreNextData(currentYearTemp, currentMonthTemp, 1, changeTag)
      }else {//向左滑动 月份加一 1->2
        console.log('第一次向左滑动')
        changeTag = 0;
        let {currentYearTemp,currentMonthTemp} = this.handleCalcuYearMonthAdd(currentYear,currentMonth)
        newTimeObj = {currentYearTemp,currentMonthTemp};
        this.handlePreNextData(currentYearTemp, currentMonthTemp, 0, changeTag)
      }
    }else if(newCurrent == 1){
      if(topCurrentId == 0){//向左滑动 0->1
        changeTag = 2;
        let {currentYearTemp,currentMonthTemp} = this.handleCalcuYearMonthAdd(currentYear,currentMonth)
        newTimeObj = {currentYearTemp,currentMonthTemp};
        this.handlePreNextData(currentYearTemp, currentMonthTemp, 0, changeTag)
      }else {//向右滑动 2->1
        changeTag = 0;
        let {currentYearTemp,currentMonthTemp} = this.handleCalcuYearMonthReduce(currentYear,currentMonth)
        newTimeObj = {currentYearTemp,currentMonthTemp};
        this.handlePreNextData(currentYearTemp, currentMonthTemp, 1, changeTag)
      }
    }else {
      if(topCurrentId == 1){//向右滑动 1->0
        changeTag = 2
        let {currentYearTemp,currentMonthTemp} = this.handleCalcuYearMonthReduce(currentYear,currentMonth)
        newTimeObj = {currentYearTemp,currentMonthTemp};
        this.handlePreNextData(currentYearTemp, currentMonthTemp, 1, changeTag)
      }else {//向左滑动 2->0
        changeTag = 1
        let {currentYearTemp,currentMonthTemp} = this.handleCalcuYearMonthAdd(currentYear,currentMonth)
        newTimeObj = {currentYearTemp,currentMonthTemp};
        this.handlePreNextData(currentYearTemp, currentMonthTemp, 0, changeTag)
      }
    }
    topCurrentId = newCurrent;
    this.setData({
      currentYear: newTimeObj.currentYearTemp,
      currentMonth: newTimeObj.currentMonthTemp,
      currentId: newCurrent,
    })
    this.handleSwiperDataHeight(this.data.swiperEmpty[this.data.currentId],this.data.swiperDays[this.data.currentId]);
  },
  handleTopMonth(){
    let currentId = this.data.currentId;
    let newCurrent;
    if(currentId == 0){
      newCurrent = 2
    }else if(currentId == 1){
      newCurrent = 0
    }else {
      newCurrent = 1
    }
    console.log(newCurrent)
    this.setData ({
      currentId: newCurrent
    })
  },
  handleNextMonth(){
    let currentId = this.data.currentId;
    let newCurrent;
    if(currentId == 0){
      newCurrent = 1
    }else if(currentId == 1){
      newCurrent = 2
    }else {
      newCurrent = 0
    }
    console.log(newCurrent)
    this.setData ({
      currentId: newCurrent
    })
  },
  handleCalcuYearMonthAdd(currentYearTemp,currentMonthTemp){
    if (currentMonthTemp == 12) {
      currentMonthTemp = 1;
      currentYearTemp++;
    } else {
      currentMonthTemp++;
    }
    return {currentYearTemp,currentMonthTemp}
  },
  handleCalcuYearMonthReduce(currentYearTemp,currentMonthTemp){
    if (currentMonthTemp < 2) {
      currentMonthTemp = 12;
      currentYearTemp--;
    } else {
      currentMonthTemp--;
    }
    return {currentYearTemp,currentMonthTemp}
  },
  //预加载下个月的数据
  handlePreNextData(currentYear,currentMonth,type,changeTag){
    let currentYearTemp1 = 0;
    let currentMonthTemp1 = 0;
    if(type == 0){
      let {currentYearTemp,currentMonthTemp} = this.handleCalcuYearMonthAdd(currentYear,currentMonth)
      console.log(currentYearTemp,currentMonthTemp)
      currentYearTemp1 = currentYearTemp;
      currentMonthTemp1 = currentMonthTemp;
    }else {
      let {currentYearTemp,currentMonthTemp} = this.handleCalcuYearMonthReduce(currentYear,currentMonth)
      currentYearTemp1 = currentYearTemp;
      currentMonthTemp1 = currentMonthTemp;
    }
    console.log(currentYearTemp1,currentMonthTemp1)
    // this.setData({
    //   currentYearTemp,
    //   currentMonthTemp,
    // })
    this.handleCalcuEmptyDaysOfmonth(currentYearTemp1, currentMonthTemp1, changeTag);
    this.handleCalculateDays(currentYearTemp1, currentMonthTemp1, changeTag);
    
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
    console.log(swiperDaysTemp)
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
  // 选择日期和月份
  handleChooseYearMonth(){
    const currentYear = this.data.currentYear;
    const currentMonth = this.data.currentMonth;
    var currentDay = this.data.currentDay;
    const weeks = this.data.weeks;
    let pickerYear = [],
        pickerDay = [],
        pickerMonth = [];
    for (let i = 1900; i <= 2100; i++) {
      pickerYear.push(i);
    }
    for (let i = 1; i <= 12; i++) {
      pickerMonth.push(i);
    }
    var thisMonthDays = this.getThisMonthDays(currentYear,currentMonth);
    if (currentDay > thisMonthDays){
      currentDay=1;
    }
    for (let i = 1; i <= thisMonthDays; i++){
      pickerDay.push(i)
    }
    const yearIndex = pickerYear.indexOf(currentYear);
    const monthIndex = pickerMonth.indexOf(currentMonth);
    const dayIndex = pickerDay.indexOf(currentDay);
   
    this.setData({
      pickerValue: [monthIndex, dayIndex, yearIndex],
      chooseYear: currentYear,
      chooseMonth: currentMonth,
      chooseDay: currentDay,
      pickerYear,
      pickerDay,
      pickerMonth,
    });
    setTimeout(() => {
      this.setData({
        pickerValue: [monthIndex, dayIndex, yearIndex],
      });
    }, 1000);
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