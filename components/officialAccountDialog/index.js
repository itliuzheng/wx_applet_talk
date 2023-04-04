// components/homeDialog/index.js
var app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type:{
      type: String,
      value: ''
    },
    qrCode:{
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    modal_status: !false,
    modal_status2: !false,
    permissionInfo: {}
  },
  lifetimes: {
    ready(){
      console.log('read');
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
    /**
     * 保存图片
     * @param {*} e 
     */
    savePhoto(e) {
      let url = e.currentTarget.dataset.url;
      if(url){
        wx.saveImageToPhotosAlbum({
          filePath: url,
          success(res) {
            wx.showToast({
              title: '已保存到相册~',
            })
            // _this.closeFun();
            console.log('success',res);
          },
          fail(res) {
            console.log('fail',res);
            wx.previewImage({
              current: url,
              urls: [url]
            });
            wx.showToast({
              title: '请自行保存~',
              icon:'error'
            })
          }
        })
      }
    },
  }
})