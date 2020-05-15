// components/swiper/swiper.js
Component({
  properties: {
    images: {
      type: Array,
      default: []
    },
    isDetail: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleSwiperChange(event){
      this.triggerEvent('swiperChange',{index:event.detail.current},{})
    }
  }
})
