// pages/equipment-list/equipment-list.js
import {fetchGetList} from '../../service/equipment'
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  classificationId: null,
  screStr: '',
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    equipmentClassificationId: '',
    equipmentClassificationName: '',
    listQuery: JSON.parse(JSON.stringify(defaultListQuery)),
    equipListData: []
  },
  onLoad(options){
    console.log(options);
    this.setData({
      equipmentClassificationId: options.id,
      equipmentClassificationName: options.name
    })
    this.getEquipList("");
  },
  getEquipList(val){
    this.data.listQuery.classificationId = parseInt(this.data.equipmentClassificationId);
    this.data.listQuery.screStr = val;
    fetchGetList(this.data.listQuery).then(res => {
      console.log(res.data.list);
      if(res.code == 200)
      this.setData({
        equipListData: res.data.list
      })
    })
  },
  handleEquipmentClick(event){
    console.log(event)
    wx.navigateTo({
      url: '/pages/equipment-detail/equipment-detail?id=' + event.currentTarget.dataset.id,
    })
  },
  handleSearch(e){
    this.getEquipList(e.detail.value)
  },
})