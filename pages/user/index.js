const app = getApp()

Page({
  data: {
    config: app.globalData.config,
    // wxUser: null,
    wxUser: {
      nickName:'微信用户',
      // headimgUrl:'/public/img/myself/default_head.png',
      headimgUrl:'data:image/png;base64,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',
      phone: null
    },
    userCenter: null,
    count:0,
    showModal: false
  },
  onShow() {
    // this.getUserInit();

  },
  reload() {
    // this.getUserInit()
  },
  getUserInit(){
    app.wxUserGet().then(data => {
      if (app.globalData.wxUser) {
        this.setData({
          wxUser: app.globalData.wxUser
        }, () => {
          if(data){
            this.getPersonCenter();
          }
        })
      }
    })
  },
  onLoad() {
    // app.initPage().then(res=>{
    //   this.wxUserGet();
    //   this.getPersonCenter();
    // })
    // if(this.data.config.adEnable){
    // 在页面中定义插屏广告
    // let interstitialAd = null
    // 在页面onLoad回调事件中创建插屏广告实例
    // if (wx.createInterstitialAd) {
    //   interstitialAd = wx.createInterstitialAd({
    //     adUnitId: this.data.config.adInsertScreenID
    //   })
    //   interstitialAd.onLoad(() => { })
    //   interstitialAd.onError((err) => { })
    //   interstitialAd.onClose(() => { })
    // }
    // // 在适合的场景显示插屏广告
    // if (interstitialAd) {
    //   interstitialAd.show().catch((err) => {
    //     console.error(err)
    //   })
    // }
    // }
  },
  /**
   * 小程序设置
   */
  settings: function () {
    wx.openSetting({
      success: function (res) {
        console.log(res.authSetting)
      }
    })
  },
  getUserProfile(e) {
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (detail) => {
        app.api.wxUserSave(detail)
          .then(res => {
            let wxUser = res.data
            this.setData({
              wxUser: wxUser
            })
            app.globalData.wxUser = wxUser
            // this.wxUserGet();
            this.getPersonCenter();
          })
      }
    })
  },
  //获取用户信息
  wxUserGet() {
    return app.api.wxUserGet()
      .then(res => {
        console.log(res.data);
        this.setData({
          wxUser: res.data
        })
        return res
      })
  },
  share() {
    console.log(1);
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline'],
      success: (res)=>{
        console.log(res);
      },
      fail: (res)=>{
        console.log(res);
      },
    })
  },
  // 资料设置
  goSetting() {
    wx.navigateTo({
      url: '/pages/user/setting/index',
    })
  },
  // 分享给朋友
  onShareAppMessage(){
    console.log('11');
    const promise = new Promise(resolve => {
      setTimeout(() => {

        app.api.wxRechargeUpdateCount({
          type:'share',
          userId : app.globalData.wxUser.openid
        })

        resolve({
          title: '自定义转发标题1',
          path: '/pages/index/index',
        })
      }, 500)
    })
    return {
      title: '自定义转发标题',
      path: '/pages/index/index',
      promise 
    }
  },
  // 分享朋友圈
  // 用于自定义分享内容，不支持自定义页面路径
  onShareTimeline(){
    console.log('222');
    const promise = new Promise(resolve => {
      setTimeout(() => {
        resolve({
          title: 'SmartAI2'
        })
      }, 500)
    })
    app.api.wxRechargeUpdateCount({
      type:'pyq',
      userId : app.globalData.wxUser.openid
    })
    return {
      title: 'SmartAI',
      query:'12',
      promise 
    }
  },
  // 提示分享朋友圈
  onShareTap: function () {
    wx.showToast({
      title: '请点击右上角...的分享朋友圈按钮',
      icon: 'none',
      duration: 3000
    })
  },
  // 点击“显示二维码”按钮时触发的事件处理函数
  onButtonClick: function() {
    this.setData({
      showModal: true
    });
  },
  // 点击弹框中的“关闭”按钮时触发的事件处理函数
  onModalClose: function() {
    this.setData({
      showModal: false
    });
  },
  // 调起相机 扫描
  onScanCodeTap: function () {
    wx.scanCode({
      success: function (res) {
        wx.showModal({
          title: '关注公众号',
          content: '关注公众号成功',
          showCancel: false,
          success: function () {
            // TODO: 引导用户进入公众号页面进行关注
          }
        })
      },
      fail: function () {
        wx.showToast({
          title: '扫码失败，请重试',
          icon: 'none'
        })
      }
    })
  }
})