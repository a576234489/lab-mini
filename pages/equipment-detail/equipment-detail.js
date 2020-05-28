// pages/equipment-detail/equipment-detail.js
import {fetchGetDetail,fetchGetEquipOpenTime,fetchAppoint,handleCollectEquip,handleDelCollectEquip} from '../../service/equipment'
const WxParse = require('../../wxParse/wxParse.js')
import {dateFormat,arraySort} from'../../utils/dateformat.js'
const app = getApp();
//轮播图上一级索引
var topCurrentId = 1
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: 0,
    //默认未收藏
    collected: false,
    equipmentId: '',
    banners: [],
    equipment: {},
    equipmentStudyVideos: [],
    totalSwiper: null,
    currentSwiper: 1,
    buttonActiveIndex: 1,
    videoCoverIsShow: [],
    appointDialog: false,
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
    timeSelectorDialog: false,
    //初始化选择的天数
    chooseDayId: 0,
    //可预约时间断
    openTime: [],
    //选中的时间断索引
    selectOpenTimeIndex: [],
    //预约开始时间
    appointStartTime: null,
    //预约时长
    appointLong: null,
    //当前用户
    userInfo: {},
    //是否显示日历
    isShowCalendar: true,
    //预约弹框动画效果
    animationAppointData: {},
    //预约遮罩层动画效果
    animationAppointShadow: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      equipmentId: options.id
    })
    console.log(options)
    this.handleInitUserInfo();
    this.handleGetDetail();
    this.handleInitData(new Date());
  },
  handleGetDetail(){
    fetchGetDetail({equipmentId:this.data.equipmentId,userId:this.data.userId}).then(res => {
      let banners = res.data.equipment.equipmentUrl.split(',')
      let videos = res.data.equipmentStudyVideos;
      let videoCoverIsShow = []
      videos.forEach(item => {
        videoCoverIsShow.push(true);
      })
      let collected = false;
      if(res.data.collectionId != 0){
        collected = true;
      }
      this.setData({
        banners: banners,
        equipment: res.data.equipment,
        totalSwiper: banners.length,
        equipmentStudyVideos: videos,
        videoCoverIsShow: videoCoverIsShow,
        collected
      })
      const basicInfo = this.data.equipment.basicInfo ;
      const that = this;
      WxParse.wxParse('basicInfo', 'html', basicInfo, that,5);
      const operationManual =  this.data.equipment.operationManual;
      WxParse.wxParse('operationManual', 'html', operationManual, that,5);
    })
  },
  handleInitData(date){
    console.log(date);
    let currentYear = date.getFullYear();
    let currentMonth = date.getMonth() + 1;
    let currentDay = date.getDate();
    let chooseDayId = currentDay - 1;
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
      currentDay: currentDay,
      chooseDayId: chooseDayId
    })
    this.handleSwiperDataHeight(this.data.swiperEmpty[this.data.currentId],this.data.swiperDays[this.data.currentId]);
    this.handleInitDayClick();
    let dateNow = dateFormat('YYYY-mm-dd',date);
    this.handleGetEquipOpenTime(dateNow,this.data.equipmentId);
  },
  //切换日历是否显示
  handleToggleCanader(){
    this.setData({
      isShowCalendar: !this.data.isShowCalendar
    })
  },
  //初始化当前用户
  handleInitUserInfo(){
    this.setData({
      userInfo: app.globalData.userInfo,
      userId: app.globalData.userInfo.userId
    })
  },
  //初始化天点击
  handleInitDayClick(){
    let chooseDayId;
    if(this.data.chooseDayId){
      chooseDayId = this.data.chooseDayId;
    }else {
      chooseDayId = this.data.currentDay - 1;
    }
    console.log(chooseDayId);
    let currentId = this.data.currentId;
    let days = this.data.swiperDays[currentId];
    days[chooseDayId].choosed = true;
    let swiperDays = this.data.swiperDays;
    swiperDays[currentId] = days;
    this.setData({
      days: days,
      swiperDays: swiperDays,
    })
    console.log(this.data.swiperDays)
  },
  //日历上点击某一天
  handleDaysItemClick(event){
    console.log(event);
    let parentIdx = event.currentTarget.dataset.parentidx;
    let childIdx = event.currentTarget.dataset.childidx;
    console.log(parentIdx,childIdx);
    let days = this.data.swiperDays[parentIdx];
    let swiperDays = this.data.swiperDays;
    for (var i = 0; i < days.length; i++) {
      if(childIdx == i){
        days[i].choosed = true;
      }else {
        days[i].choosed = false;
      }
    }
    swiperDays[parentIdx] = days;
    this.setData({
      currentDay: childIdx + 1,
      swiperDays: swiperDays,
      selectOpenTimeIndex: [],
      appointStartTime: null,
      appointLong: null,
    })
    let dateNow = dateFormat('YYYY-mm-dd',new Date(this.data.currentYear,this.data.currentMonth - 1,this.data.currentDay));
    console.log(dateNow);
    this.handleGetEquipOpenTime(dateNow,this.data.equipmentId);
  },
  //就算swiper高度
  handleSwiperDataHeight(swiperEmpty,swiperDays){
    let length = swiperEmpty.length + swiperDays.length;
    console.log(Math.ceil(length/7));
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
    let dateNow = dateFormat('YYYY-mm-dd',new Date(this.data.currentYear,this.data.currentMonth - 1,this.data.currentDay));
    console.log(dateNow);
    this.handleGetEquipOpenTime(dateNow,this.data.equipmentId);
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
    let currentYear = this.data.currentYear;
    let currentMonth = this.data.currentMonth;
    let currentDay = this.data.currentDay;
    let date = new Date(Date.UTC(currentYear,currentMonth - 1,currentDay));
    let currentWeek = this.getCurrentWeeks(date);
    let pickerYear = [],
        pickerDay = [],
        pickerMonth = [];
    for (let i = 1900; i <= 2100; i++) {
      pickerYear.push(i);
    }
    for (let i = 1; i <= 12; i++) {
      pickerMonth.push(i);
    }
    let thisMonthDays = this.getThisMonthDays(currentYear,currentMonth);
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
      chooseWeek: currentWeek,
      pickerYear,
      pickerDay,
      pickerMonth,
      timeSelectorDialog: true,
      selectOpenTimeIndex: [],
      appointStartTime: null,
      appointLong: null,
    });
  },
  //点击今天
  handleClickToday(){
    let date = new Date();
    let currentYear = date.getFullYear();
    let currentMonth = date.getMonth() + 1;
    let currentDay = date.getDate();
    // let currentYear = this.data.currentYear;
    // let currentMonth = this.data.currentMonth;
    // let currentDay = this.data.currentDay;
    // let date = new Date();
    // date.setFullYear(currentYear,(currentMonth - 1),currentDay);
    let currentWeek = this.getCurrentWeeks(date);
    let thisMonthDays = this.getThisMonthDays(currentYear,currentMonth);
    let pickerDay = [];
    for (let i = 1; i <= thisMonthDays; i++){
      pickerDay.push(i)
    }
    this.setData({
      pickerDay: pickerDay,
    })
    const yearIndex = this.data.pickerYear.indexOf(currentYear);
    const monthIndex = this.data.pickerMonth.indexOf(currentMonth);
    const dayIndex = pickerDay.indexOf(currentDay);
    this.setData({
      pickerValue: [monthIndex, dayIndex, yearIndex],
      chooseYear: currentYear,
      chooseMonth: currentMonth,
      chooseDay: currentDay,
      chooseWeek: currentWeek, 
      pickerDay,
    });  
    
  },
  //获取当前天是星期几
  getCurrentWeeks(date) {
    const weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
    var weeks_number = date.getDay();
    // console.log("数字  星期" + weeks_number);
    return weeks_ch[weeks_number];
  },
  //监听pickerview滚动
  handlePickerChange(event){
    const val = event.detail.value;
    console.log(val);
    let pickerDay = []

    let chooseMonth = this.data.pickerMonth[val[0]];
    let chooseDay = this.data.pickerDay[val[1]];
    let chooseYear = this.data.pickerYear[val[2]]
    console.log(chooseMonth,chooseDay,chooseYear);
    // 更改滚动选择器天数
    if (this.data.chooseMonth != this.data.pickerMonth[val[0]] || this.data.pickerYear[val[2]] != this.data.chooseYear){
      var thisMonthDays = this.getThisMonthDays(chooseYear, chooseMonth);
      for (let i = 1; i <= thisMonthDays; i++) {
        pickerDay.push(i)
      }
      this.setData({
        pickerDay: pickerDay,
      })
    }
    console.log(val);
    let date = new Date(Date.UTC(chooseYear, chooseMonth-1 , chooseDay));
    let chooseWeek = this.getCurrentWeeks(date);
    this.setData({
      chooseYear,
      chooseMonth,
      chooseDay,
      chooseWeek
    })
  },
  //点击pickerview确定
  handleClickConfirm(e){
    let that = this;
    topCurrentId = 1;
    this.setData({
      currentYear: that.data.chooseYear,
      currentMonth: that.data.chooseMonth,
      currentDay: that.data.chooseDay,
      swiperDays: [],
      swiperEmpty: [],
      timeSelectorDialog: false
    })
    var date = new Date(that.data.chooseYear, that.data.chooseMonth-1, that.data.chooseDay);
    this.handleInitData(date);
  },
  //关闭时间弹出框
  handleCloseTimeDilog(){
    this.setData({
      timeSelectorDialog: false
    })
  },
  //获取设备可预约的时间断
  handleGetEquipOpenTime(date,equipmentId){
    console.log(1122)
    fetchGetEquipOpenTime({date: date,equipmentId:equipmentId}).then(res => {
      console.log(res);
      if(res.code == 200) {
        let opentTime = [];
        res.data.forEach(item => {
          opentTime.push({data: item,choosed: false});
        })
        let count = 0;
        if(opentTime.length % 3 != 0){
          count = 3 - opentTime.length % 3;
        }
        if(count != 0){
          for(let i = 0; i < count; i++){
            opentTime.push('')
          }
        }
        this.setData({
          openTime: opentTime,
          openTimeNumber: res.data
        })
      } else {
        this.setData({
          openTime: [],
        })
      }    
    })
    
  },
  //选择预约时间
  handleSelectAppointTime(event){
    let data = event.currentTarget.dataset.date.data;
    let index = event.currentTarget.dataset.index;
    let openTime = this.data.openTime;
    let selectOpenTimeIndex  = this.data.selectOpenTimeIndex;
    //选中数组大小为0 必定是选择时间点
    if(selectOpenTimeIndex.length == 0){
      selectOpenTimeIndex.push(index)
      openTime.forEach(item => {
        if(item.data == data){
            item.choosed = true
        }
      })
    }else {
      //数组大小不为0时 先判断是选择时间点还是取消时间点
      let select = true;
      openTime.forEach(item => {
        if(item.data == data){
          if(item.choosed){
            select = false
          }
        }
      })
      let selectOpenTimeIndexOrder = arraySort(selectOpenTimeIndex);
      let min = selectOpenTimeIndexOrder[0]
      let max = selectOpenTimeIndexOrder[selectOpenTimeIndexOrder.length - 1];
      //选择时间
      if(select){
        let isSeries = this.handleVerificaTime(index,min,max);
        //不连续
        if(!isSeries){
          return;
        }
        selectOpenTimeIndex.push(index);
        openTime.forEach(item => {
          if(item.data == data){
              item.choosed = true
          }
        })
      }else{
        let selectOpenTimeIndexOrder = arraySort(selectOpenTimeIndex);
        //取消时间
        if(selectOpenTimeIndex.length == 1 || selectOpenTimeIndex.length==2){
          openTime.forEach(item => {
            if(item.data == data){
                item.choosed = false
            }
          })
          selectOpenTimeIndex.splice(selectOpenTimeIndex.indexOf(index),1);
        }else {
          let min = selectOpenTimeIndexOrder[0]
          let max = selectOpenTimeIndexOrder[selectOpenTimeIndexOrder.length - 1];
          console.log(min,max,index)
          if(index > min && index < max){
            wx.showToast({
              title: '不能跨时间断选择预约时间',
              duration: 1000,
              icon: 'none'
            })
            return;
          }
          openTime.forEach(item => {
            if(item.data == data){
                item.choosed = false
            }
          })
          console.log(selectOpenTimeIndex,index);
          selectOpenTimeIndex.splice(selectOpenTimeIndex.indexOf(index),1);
        }
      }    
    } 
    this.handleSetOpenTimeAndLong();
    this.setData({
      openTime: openTime,
      selectOpenTimeIndex: selectOpenTimeIndex
    })
  },
  //设置预约开始时间及预约时长
  handleSetOpenTimeAndLong(){
    let opentTime = this.data.openTime;
    let selectTime = [];
    opentTime.forEach(res => {
      if(res.choosed){
        selectTime.push(res.data)
      }
    })
    let selectTimeSort = arraySort(selectTime);
    console.log(selectTimeSort)
    let long;
    let appointStartTime;
    if(selectTimeSort.length == 0){
      long = null;
      appointStartTime = null;
    }else if(selectTimeSort.length == 1){
      long = 1;
      appointStartTime = selectTimeSort[0];
    }else {
      long = parseInt(selectTimeSort[selectTimeSort.length - 1] - parseInt(selectTimeSort[0])) + 1;
      appointStartTime = selectTimeSort[0];
    }
    console.log(long,appointStartTime)
    this.setData({
      appointStartTime,
      appointLong: long
    })
  },
  //验证选中时时间段是否连续
  handleVerificaTime(index,min,max){
    if(index > max){
      if((index - max) > 1){
        wx.showToast({
          title: '不能跨时间断选择预约时间',
          duration: 1000,
          icon: 'none'
        })
        return false;
      }
    }else {
      if(min - index > 1){
        wx.showToast({
          title: '不能跨时间断选择预约时间',
          duration: 1000,
          icon: 'none'
        })
        return false;
      }
    }
    return true;
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
    let windowHegiht;
    wx.getSystemInfo({
      success: res => {
        windowHegiht = res.windowHeight;
      }
    })
    windowHegiht = windowHegiht - 100;
    console.log(windowHegiht);
    let animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linera",
      delay: 0
    }) 
    let animation2 = wx.createAnimation({
      duration: 200,
      timingFunction: "linera",
      delay: 0
    }) 
    // this.animation = animation ;
    animation.translateY(windowHegiht).step();
    animation2.opacity(0).step();
    this.setData({
      appointDialog: true,
      animationAppointData: animation.export(),
      animationAppointShadow: animation2.export()
    });
    setTimeout(() => {
      animation.translateY(0).step()
      animation2.opacity(0.4).step();
      this.setData({
        animationAppointData: animation.export(),
        animationAppointShadow: animation2.export()
      })
    }, 200);
    this.handleInitData(new Date())
  },
  handleHiddenAppoint(){
    let windowHegiht;
    wx.getSystemInfo({
      success: res => {
        windowHegiht = res.windowHeight;
      }
    })
    windowHegiht = windowHegiht - 100;
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    var animation2 = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    animation.translateY(windowHegiht).step()
    animation2.opacity(0).step()
    this.setData({
        animationAppointData: animation.export(),
        animationAppointShadow: animation2.export(),
    })
    setTimeout(() => {
      animation.translateY(0).step();
      animation2.opacity(0.4).step();
      this.setData({
          animationData: animation.export(),
          animationData: animation2.export(),
          appointDialog: false
      })
    }, 200)
  },
  handleConfirmAppoint(){
    wx.showModal({
      title: '提示',
      content: '是否确认预约?',
      success: res => {
        if(res.confirm){
          let currentMonth;
          if(this.data.currentMonth < 10){
            currentMonth = "0" + this.data.currentMonth;
          }else{
            currentMonth = currentMonth
          }
          
          let dateStr = this.data.currentYear + '-' + currentMonth + '-' + this.data.currentDay;
          let opentTime = this.data.openTime;
          let appointTimeStr = ''
          opentTime.forEach(item => {
            if(item.choosed){

              appointTimeStr += item.data + ',';
            }
          })
          if(appointTimeStr == ''){
            wx.showToast({
              title: '请先选择预约时间断',
              duration: 1000,
              icon: 'none'
            })
            return;
          }else {
            appointTimeStr = appointTimeStr.substr(0,appointTimeStr.length - 1);
          }
          let data = {
            userId: this.data.userInfo.userId,
            equipmentId: parseInt(this.data.equipmentId),
            dateStr: dateStr,
            appointTimeStr: appointTimeStr
          }
          fetchAppoint(data).then(res => {
            console.log(res)
            if(res.code == 200){
              wx.redirectTo({
                url: '/pages/result/appointApproval/appointApprovalResult',
              })
            }else {
              wx.showToast({
                title: res.data.message,
                duration: 1000,
                icon: 'none'
              })
            }
          })
        }
      }
    })
  },
  handleMaintain(){
    wx.navigateTo({
      url: '../../pages/maintain/chilCpns/maintain-equipment/maintain-equipment?id=' + this.data.equipmentId,
    })
  },
  handleCollectEquip(){
    let data = {userId: this.data.userInfo.userId,equipmentId: this.data.equipmentId}
    if(this.data.collected){
      handleDelCollectEquip(data).then(res => {
        if(res.code == 200){
          this.setData({
            collected: false
          })
        }
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 1000
        })
      })
    }else {
      handleCollectEquip(data).then(res => {
        if(res.code == 200){
          this.setData({
            collected: true
          })
        }
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 1000
        })
      })
    }
  }


})