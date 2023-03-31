// components/homeDialog/index.js
var app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    endDate:{},
    startDate:{}
  },

  /**
   * 组件的初始数据
   */
  data: {
  },
  lifetimes: {
    ready(){
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    close_btn(){
      this.triggerEvent('showDialog')
      // this.setData({
      //   modal_status: false, //  首页弹窗隐藏
      //   modal_status2: false, // 遮罩层隐藏
      // });
    },
  }
})