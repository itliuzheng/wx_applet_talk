var app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item:{}
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
    // 设置已读
    setRead(e){
      let { id } = e.currentTarget.dataset;
      app.api.postNoticeGetSysSetRead(id)
      .then(()=>{
        this.triggerEvent('readSuccess');
        wx.navigateTo({
          url: "/pages/user/member-detail/index"
        });
      })
    }
  }
})
