
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    console.log('user-phone:onLoad');
    // app.initPage()
    // .then(()=>{
      if(app.globalData.wxUser.phone){
        wx.redirectTo({
          url: "/pages/user-auth/index"
        })
      }
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  agreeGetPhoneNumber(e) {
    // console.log(e);
    if (e.detail.errMsg == 'getPhoneNumber:ok') {

      app.api.wxUserPhoneSave(e.detail)
      .then(res => {
        let wxUser = res.data;
        app.globalData.wxUser = wxUser;
        wx.redirectTo({
          url: "/pages/user-auth/index"
        })
      })
      .catch(()=>{
        wx.clearStorageSync();
      })
    }
  },
  goBack(){
    wx.navigateBack({
      delta:1,
      fail:function(){
        wx.switchTab({
          url:'/pages/index/index'
        })
      }
    })
  },
  getUserProfile(e) {
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (detail) => {
        app.initPage()
        .then((res)=>{
          console.log(app.globalData.wxUser);
          setTimeout(()=>{
            app.api.wxUserSave(detail)
            .then(res => {
              let wxUser = res.data;
              app.globalData.wxUser = wxUser;
              wx.switchTab({
                url:'/pages/index/index'
              })
            })
          },0)
        })
      }
    })
  },
})