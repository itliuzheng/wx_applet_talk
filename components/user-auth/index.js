
const app = getApp()
Component({
  properties: {
    switchOn: {
      type: Boolean,
      value: true
    },
  },
  data: {
    wxUser: null
  },
  lifetimes: {
    // 组件所在页面的生命周期函数
    ready: function () {
      app.initPage()
      .then(()=>{
        console.log('ue-auth',!app.isLogin());
        console.log(app.globalData.wxUser);
        if(!app.globalData.wxUser.phone){
          wx.redirectTo({
            url: "/pages/user-phone/index"
          })
        }else if(!app.globalData.wxUser.nickName){
          wx.redirectTo({
            url: "/pages/user-auth/index"
          })
        }
        // if(!app.isLogin()){
          // wx.redirectTo({
          //   url: "/pages/user-phone/index"
          // })
        // }else{
          // 废弃
          // this.triggerEvent('reload')
          // wx.reLaunch({
          //   url: getApp().getCurrentPageUrlWithArgs()
          // })
        // }
      })
    }
  },
  methods: {
  }
})