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
    this.handleGetMyMainTainList();
  },
  handleGetMyMainTainList(){

  },
  handleGetUserInfo(){
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },
  handleGetMyMainTainList(){
    let data = {pageNum: 1,pageSize: 10,userId: this.data.userInfo.userId};
    fetchGetMyMainTainList(data).then(res => {
      console.log(res);
    })
  }

})