/**
 * <version>1.0.0</version>
 */
import api from './utils/api'
import __config from './config/env'

let _thirdSession = null;
let _wxUser = null;
// wx.clearStorageSync();
try {
  _thirdSession = wx.getStorageSync('thirdSession');
  _wxUser = wx.getStorageSync('wxUser');
  if (_wxUser) _wxUser = JSON.parse(_wxUser);
} catch (e) {

}


App({
  api: api,
  globalData: {
    thirdSession: _thirdSession,
    wxUser: _wxUser,
    config: __config,
    share_wid: null,
    permissionInfo: {} // 用户限制信息
  },
  onLaunch: function () {

    //检测新版本
    this.updateManager()
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })

    // 加载自定义字体
    // wx.loadFontFace({
    //   global: true,
    //   family: 'GenSenRoundedJP-L',
    //   source: 'url("https://static.yuedu.love/font/ResourceHanRoundedCN-Normal.ttf")', // 资源圆体
    //   success: function (res) {
    //   }
    // })
  },
  updateManager() {
    const updateManager = wx.getUpdateManager()
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            updateManager.applyUpdate()
          }
        }
      })
    })
  },
  //初始化，供每个页面调用 
  initPage: function () {
    let that = this;
    return new Promise((resolve, reject) => {
      return resolve("success");
      if (!that.globalData.thirdSession) { //无thirdSession，进行登录
        that.doLogin()
          .then(res => {
            resolve("success")
          })
      } else { //有thirdSession，说明已登录，返回初始化成功
        wx.checkSession({ //检查登录态是否过期
          success() {
            //获取用户信息
            that.wxUserGet()
            .then( ()=>{
              //session_key 未过期，并且在本生命周期一直有效
              console.log('session_key 未过期')
              resolve("success")
            })
          },
          fail() {
            // session_key 已经失效，需要重新执行登录流程
            console.log('session_key 已经失效')
            that.doLogin()
              .then(res => {
                resolve("success")
              })
          }
        })

      }
    })
  },
  /**
   * 是否显示小红点
   */
  getNoReadCount(){

    // wx.showTabBarRedDot({
    //   index:3,
    //   success:()=>{
    //   }
    // })

    // wx.hideTabBarRedDot({
    //   index:3,
    //   success:()=>{
    //   }
    // })
  },
  doLogin() {
    wx.showLoading({
      title: '登录中',
    })

    let that = this;
    return new Promise((resolve, reject) => {
      wx.login({
        success: function (res) {
          if (res.code) {
            let yuedu_share_wid = null;
            try {
              yuedu_share_wid = wx.getStorageSync('yuedu_share_wid');
            } catch (e) {}
            // api.login({
            //     jsCode: res.code,
            //     wid: that.globalData.share_wid || yuedu_share_wid
            //   })
            //   .then(res => {
            //     wx.hideLoading()
            //     let wxUser = res.data;
            //     that.globalData.thirdSession = wxUser.sessionKey;
            //     that.globalData.wxUser = wxUser;
            //     wx.setStorage({
            //       key: "thirdSession",
            //       data: wxUser.sessionKey
            //     })
            //     wx.setStorage({
            //       key: "wxUser",
            //       data: JSON.stringify(wxUser)
            //     })
            //     resolve("success")
            //   })
          }
        }
      })
    })
  },
  isLogin() {
    return this.globalData.wxUser && this.globalData.wxUser.phone && this.globalData.wxUser.headimgUrl
    // if(!this.globalData.wxUser){
    //   wx.navigateTo({
    //     url: "/pages/user-phone/index"
    //   });
    //   return false;
    // }
    // return true;
  },
  // 进行判断是否登录 是否授权 否则前往授权页
  ifLoginNavigate(){
    return new Promise((resolve,reject)=>{
      if(this.globalData.wxUser && !this.globalData.wxUser.phone){
        console.log('没有授权手机号');
        wx.navigateTo({
          url: "/pages/user-phone/index"
        });

        reject();
      }
      if(this.globalData.wxUser && !this.globalData.wxUser.headimgUrl){
        console.log('没有授权微信头像');
        wx.navigateTo({
          url: "/pages/user-auth/index"
        });
        reject();
      }
      resolve();
    })
  },
  //获取用户信息
  wxUserGet(){
    let that = this;
      return api.wxUserGet()
      .then(res => {
        console.log(res.data);
        that.globalData.wxUser = res.data || {};
        return res.data
      })
  },
  isPermission(typeName) {
    let _this = this;
    return new Promise((resolve, reject) => {
      // 
      console.log('wxUserGet---',typeName);
      api.wxUserGet()
      .then(resp => {
          console.log(resp);
          _this.globalData.wxUser = resp.data;
          if(!resp.data){
            reject({phone:null});
            return false;
          }
          // type 0普通用户 1体验会员 2会员
          if(resp.data.type === 0){
            if(!resp.data.phone){
              reject(resp.data);
              return false;
            }
            api.limitUser().then(res=>{
              let data = res.data;
              _this.globalData.permissionInfo = data;
              switch (typeName) {
                case "文章":
                  // 文章限制：0-限制，1-不限制
                  data.articleDetail === 1?resolve():reject();
                  break;
                case "书评":
                  // 书评限制：0-限制，1-不限制
                  data.articleComment === 1?resolve():reject();
                  break;
                case "评论":
                  if(data.articleComment === 1){
                    wx.showToast({
                      icon:'none',
                      title: '该功能仅对会员开放'
                    })
                  }
                  // 评论限制：0-限制，1-不限制
                  data.articleComment === 1?resolve():reject();
                  break;
                case "点赞":
                  // 点赞限制：0-限制，1-不限制X
                  if(data.articlePraise === 1){
                    wx.showToast({
                      icon:'none',
                      title: '该功能仅对会员开放'
                    })
                  }
                  data.articlePraise === 1?resolve():reject();
                  break;
                case "文章评论点赞":
                  if(data.articleCommentPraise === 1){
                    wx.showToast({
                      icon:'none',
                      title: '该功能仅对会员开放'
                    })
                  }
                  // 点赞限制：0-限制，1-不限制
                  data.articleCommentPraise === 1?resolve():reject();
                  break;
                case "活动评论":
                  // 点赞限制：0-限制，1-不限制
                  data.activityComment === 1?resolve():reject();
                  break;
                case "活动点赞":
                  // 点赞限制：0-限制，1-不限制
                  data.activityPraise === 1?resolve():reject();
                  break;
                default:
                  resolve(data);
                  break;
              }
            })
          }else{
            resolve(resp.data)
          }
        })
    })
  },
  getWid(options) {
    let scene = decodeURIComponent(options.scene);
    if (scene != 'undefined') {
      let widarr = scene.split('=');
      wx.setStorage({
        key: "yuedu_share_wid",
        data: widarr[1]
      })
      this.globalData.share_wid = widarr[1];
      console.log('邀请人id==',this.globalData.share_wid );
    }
    if (options.wid) {
      wx.setStorage({
        key: "yuedu_share_wid",
        data: options.wid
      })
      this.globalData.share_wid = options.wid
    }
  },
  //获取当前页面带参数的url
  getCurrentPageUrlWithArgs() {
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    const url = currentPage.route
    const options = currentPage.options
    let urlWithArgs = `/${url}?`
    for (let key in options) {
      const value = options[key]
      urlWithArgs += `${key}=${value}&`
    }
    urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)
    return urlWithArgs
  },
  compareVersion(v1, v2) {
    v1 = v1.split('.')
    v2 = v2.split('.')
    const len = Math.max(v1.length, v2.length)

    while (v1.length < len) {
      v1.push('0')
    }
    while (v2.length < len) {
      v2.push('0')
    }

    for (let i = 0; i < len; i++) {
      const num1 = parseInt(v1[i])
      const num2 = parseInt(v2[i])

      if (num1 > num2) {
        return 1
      } else if (num1 < num2) {
        return -1
      }
    }

    return 0
  }
})