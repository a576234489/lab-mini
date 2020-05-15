// pages/equipment/childCpns/sub-category/sub-category.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    subCategory: {
      type: Array,
      default: []
    }
  },
  methods: {
    handleSubCategoryClick(event){
      let id = event.currentTarget.dataset.id;
      let name = event.currentTarget.dataset.name;
      wx.navigateTo({
        url: '/pages/equipment-list/equipment-list?id='+id+'&name='+name,
      })
    }
  }
})
