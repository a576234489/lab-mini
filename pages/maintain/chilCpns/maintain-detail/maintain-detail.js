// pages/maintain/chilCpns/maintain-detail/maintain-detail.js
import {fetchGetMainTainDetail} from '../../../../service/equipment'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    maintainData: null
  },
  onLoad(options){
    console.log(options);
    this.handleGetMainTainDetail(options.id)
  },
  handleGetMainTainDetail(id){
    console.log(id)
    fetchGetMainTainDetail({maintainId:id}).then(res => {
      this.setData({
        maintainData: res.data
      })
    })
  }
})