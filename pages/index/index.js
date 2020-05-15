//index.js
//获取应用实例
const app = getApp()
import {
  fetchGetBanner,
  fetchGetNotice
} from '../../service/index.js'
Page({
  data: {
    banners: [],
    notice: ""
  },
  onLoad: function(){
    this.handleGetBanner();
    this.handleGetNotice();
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
  }
  
})
