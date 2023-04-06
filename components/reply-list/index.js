// components/reply-list/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    msgList:{
      type: Array,
      value: []
    }
    
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    resendApi(e){
      console.log(e);
      let inputVal = e.currentTarget.dataset.inputVal;
      this.triggerEvent('resendApi',{inputVal});
    },
    // 长按复制
    copyText(e){
      let value = e.currentTarget.dataset.value;
      wx.setClipboardData({
        data: value,
        success(){
          wx.getClipboardData({
            success(){
              wx.showToast({
                title: '复制成功',
              })
            }
          })
        }
      })
    },
  }
})
