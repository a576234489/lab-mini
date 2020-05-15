// pages/equipment/childCpns/menu/menu.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    topCategory: {
      type: Array,
      default: []
    }
  },
  data: {
    currentIndex: 0
  },
  methods: {
    handleTopCategoryClick(event){
      let id = event.currentTarget.dataset.id;
      this.triggerEvent("topCategoryClick",{id},{})
      this.setData({
        currentIndex: event.currentTarget.dataset.index
      })
    }
  }
})
