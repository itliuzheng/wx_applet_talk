import __config from '../config/env'

/**
 * 
 * @param {String} url 
 * @param {String} method 
 * @param {Object} data 
 * @param {Boolean} showLoading 
 */
module.exports = (url, method, data, showLoading) => {
  let _url = __config.basePath + url
  return new Promise((resolve, reject) => {
    if (showLoading){
      wx.showLoading({
        title: '加载中',
      })
    }
    wx.request({
      url: _url,
      method: method,
      data: data,
      header: {
        'app-id': wx.getAccountInfoSync().miniProgram.appId,
        'third-session': getApp().globalData.thirdSession != null ? getApp().globalData.thirdSession : ''
      },
      success(res) {
        if (res.statusCode == 200) {
          if (res.data.code != 200) {
            // console.log(res.data)
            if(res.data.code == 60002){
              wx.clearStorageSync();
              getApp().globalData.thirdSession = null;
              getApp().initPage().then(()=>{
                wx.reLaunch({
                  url: getApp().getCurrentPageUrlWithArgs()
                })
              })
            }else{
              console.log('res.data',res.data);
              if(res.data.msg === '用戶不存在'){
                wx.clearStorageSync();
                getApp().globalData.thirdSession = null;
              }else{
                wx.showModal({
                  title: '提示',
                  content: res.data.msg ? res.data.msg : '没有数据' + '',
                  success() {
                    
                  },
                  complete(){
                    if(res.data.code == 60001){
                      //session过期，则清除过期session，并重新加载当前页
                      try {
                        wx.clearStorageSync();
                        getApp().globalData.thirdSession = null;
                        
                        getApp().initPage().then(()=>{
                          wx.reLaunch({
                            url: getApp().getCurrentPageUrlWithArgs()
                          })
                        })
                      } catch(e) {
                        // Do something when catch error
                      }
                    }
                  }
                })
              }
            }
            reject(res.data.msg)
          }
          resolve(res.data)
        } else if (res.statusCode == 404) {
          wx.showModal({
            title: '提示',
            content: '接口请求出错，请检查手机网络',
            success(res) {

            }
          })
          reject()
        } else {
          console.log(res)
          wx.showModal({
            title: '提示',
            content: res.errMsg + ':' + res.data.message + ':' + res.data.msg,
            success(res) {

            }
          })
          reject()
        }
      },
      fail(error) {
        console.log(error)
        wx.showModal({
          title: '提示',
          content: '接口请求出错：' + error.errMsg,
          success(res) {

          }
        })
        reject(error)
      },
      complete(res) {
        wx.hideLoading()
      }
    })
  })
}