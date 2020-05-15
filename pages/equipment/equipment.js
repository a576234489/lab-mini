// pages/equipment/equipment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topCategory: [
      {
        id: 1,
        name: "湘潭大学A栋",
        child: [
          {
            id: 2,
            value: "A栋生物实验室"
          },
          {
            id: 11,
            value: "A栋生物实验室"
          },
          {
            id: 12,
            value: "A栋生物实验室"
          },
          {
            id: 13,
            value: "A栋生物实验室"
          }
        ]
      },
      {
        id: 2,
        name: "湘潭大学B栋",
        child: [
          {
            id: 10,
            value: "B栋生物实验室"
          },
          {
            id: 11,
            value: "B栋生物实验室"
          },
          {
            id: 12,
            value: "B栋生物实验室"
          },
          {
            id: 13,
            value: "B栋生物实验室"
          }
        ]
      },
      {
        id: 3,
        name: "湘潭大学C栋",
        child: [
          {
            id: 10,
            value: "C栋生物实验室"
          },
          {
            id: 11,
            value: "C栋生物实验室"
          },
          {
            id: 12,
            value: "C栋生物实验室"
          },
          {
            id: 13,
            value: "C栋生物实验室"
          }
        ]
      },
      {
        id: 4,
        name: "湘潭大学D栋",
        child: [
          {
            id: 10,
            value: "D栋生物实验室"
          },
          {
            id: 11,
            value: "D栋生物实验室"
          },
          {
            id: 12,
            value: "D栋生物实验室"
          },
          {
            id: 13,
            value: "D栋生物实验室"
          }
        ]
      },
      {
        id: 5,
        name: "湘潭大学E栋",
        child: [
          {
            id: 10,
            value: "E栋生物实验室"
          },
          {
            id: 11,
            value: "E栋生物实验室"
          },
          {
            id: 12,
            value: "E栋生物实验室"
          },
          {
            id: 13,
            value: "E栋生物实验室"
          }
        ]
      }
    ],
    subCategory: []
  },
  onLoad() {
    this.handleInitSubCategory();
  },
  handleInitSubCategory(){
    this.setData({
      subCategory: this.data.topCategory[0].child
    })
  },
  handleTopCategoryClick(event){
    let category = this.data.topCategory.find(item => {
      return item.id == event.detail.id;
    })
    this.setData({
      subCategory: category.child
    })
  }
})