var app = getApp();
// const OpenAI = requirePlugin('openai-plugin');
const { getMessageTime } = require('../../utils/dateUtil');

Page({
  data: {
    msgList: [
      // {
      //   type:'in',
      //   content:'服务连接失败，点击重试',
      //   avatar:'/public/img/logo/smartai-logo.png',
      //   result: 'error'
      // },
      // {
      //   type:'in',
      //   content:'你好，我是SMARTAI，最聪明的智能机器人，你可以问我任何问题，上至天文下至地理，我将知无不言言无不尽',
      //   avatar:'/public/img/logo/smartai-logo.png',
      //   result: 'error'
      // },
      // {
      //   type:'out',
      //   content:'这周末一起去吃饭吗？',
      //   avatar:'/public/img/logo/smartai-logo.png',
      //   result: 'success'
      // },
    ], // 对话列表
    wxUser:{},
    scrollIntoView: '', // 滚动到的位置
    inputVal: '', // 输入框内容
    chatGPT:null,
    messageTime: '',// 回复时间显示逻辑
    btnDisabled:true,// 按钮是否置灰状态
    btnText:'发送', //按钮文字
    canUseCount:0, //可用次数
    chatId:null, // 会话id (首次可不传，后端返回，之后需要传，用于关联上下文)
    // btnText:'回复中', //按钮文字

    scrollHeight: 0, // scroll-view的高度
    keyboardHeight: 0 ,// 软键盘的高度
    // 关注公众号弹窗
    showModal: false
  },

  // 页面加载时，初始化 ChatGPT
  onLoad() {

    const systemInfo = wx.getSystemInfoSync();
    const tabBarHeight = systemInfo.screenHeight - systemInfo.windowHeight - systemInfo.statusBarHeight - 44;
    app.globalData.navBarHeight = tabBarHeight;

    // 获取 ChatGPT 实例
    // this.chatGPT = OpenAI.createInstance({
    //   engine: 'davinci', // 使用 Davinci 引擎
    //   apiKey: '您的 API Key',
    // });
    this.getInfo();
  },
  onShow(){
    console.log('show');
    this.getUserInfo();
  },

  // 获取用户信息
  getUserInfo() {

    app.initPage()
    .then(()=>{
      app.api.wxUserAccountQueryUserInfo({
        userId : app.globalData.wxUser.openid
      })
      .then((res)=>{
        if(res.errorCode === '0000'){
          let wxUser = this.data.wxUser;
          if(res.data.viaUrl){
            wxUser.headimgUrl = res.data.viaUrl;
          }
          if(res.data.userName){
            wxUser.nickName = res.data.userName;
          }
          this.setData({
            wxUser,
            isAvatarAuth: !!res.data.viaUrl,
            isUserNameAuth: !!res.data.userName
          })
        }
        this.getUserInfoNumber();
      })
    })
  },
  // 初始化，获取对话信息
  getInfo(){
    app.initPage()
    .then(()=>{
      this.getUserInfo();
    })
    setTimeout(()=>{
      let msgList = this.data.msgList;
      if(this.data.msgList.length === 0){
        msgList.push({
          type: 'in',
          content: '你好，我是SMARTAI，最聪明的智能机器人，已接入最新的语言模型，我每天都会为你提供3次免费机会，关注公众号+6次，分享好友+3次，分享朋友圈+3次，活动期间每天免费获取上限20次，更多次数可关注公众号获取',
          avatar:'/public/img/logo/smartai-logo.png',
          result:'success'
        })
      }
      let time = msgList[msgList.length - 1].time;
      this.setData({
        messageTime:getMessageTime(time?time:new Date()),
        msgList,
        scrollIntoView: 'reply-end', // 滚动到最后一条消息
      })

      // 获取消息容器高度
      var self = this;
      wx.createSelectorQuery().select('#msg-list').boundingClientRect(function (rect) {
        self.setData({
          // scrollHeight: rect.height // 使用data更新scrollHeight，方便wxml中调用
          scrollHeight: wx.getSystemInfoSync().windowHeight // 使用data更新scrollHeight，方便wxml中调用
        });
      }).exec();
    },500)
  },
  // 获取用户次数
  getUserInfoNumber(){
    app.api.wxUserAccountQueryCount({
      userId : app.globalData.wxUser.openid
    }).then(res=>{
      this.setData({
        canUseCount:res.data
      })
    })
    .catch(()=>{
    })
  },
  // 处理用户输入
  onInput(e) {
    let value = e.detail.value;
    let btnDisabled = !value.trim();
    if(this.data.btnText === '回复中'){
      btnDisabled = true;
    }
    this.setData({
      inputVal: value,
      btnDisabled
    });
  },
  // 处理用户点击发送按钮
  onSend() {
    console.log(this.data.inputVal);
    const inputVal = this.data.inputVal.trim();
    if (!inputVal) {
      return;
    }
    
    let count = this.data.canUseCount;
    if(count <= 0){
      wx.showToast({
        icon:'none',
        title: '您当前次数已用光。'
      })
      return
    }

    let wxUser = this.data.wxUser;
    console.log(wxUser.headimgUrl);
    // 将用户输入加入对话列表
    const msgList = this.data.msgList;
    msgList.push({
      type: 'out',
      content: inputVal,
      avatar: wxUser.headimgUrl?wxUser.headimgUrl:'/public/img/logo/smartai-logo.png',
      result: 'success'
    });
    // 在用户发送消息且服务器未返回内容时，显示
    msgList.push({
      type: 'in',
      content: 'AI奋笔疾书中',
      avatar:'/public/img/logo/smartai-logo.png',
      result: 'loading'
    });
    this.setData({
      msgList,
      inputVal: '',
      btnDisabled: true,
      btnText:'回复中',
      scrollIntoView: 'reply-end', // 滚动到最后一条消息
    });
    this.apiChat(inputVal);
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
  // 请求chat
  apiChat(inputVal){
    app.api.wxChat({
      userId: app.globalData.wxUser.openid,
      context: inputVal,
      chatId: this.data.chatId
    })
    .then(res=>{
      console.log(res);
      if(res.errorCode === '0000'){
        this.setData({
          chatId: res.data.chatId,
        });
        // 成功
        this.setReply(res.data.context);
      }else{
        // 失败
        this.replyError(inputVal);
      }
    })
    .catch(()=>{
      this.replyError(inputVal);
    })
  },
  // 设置ai回复时，逐字显示动效 
  setReply(replyContent){
    const msgList = this.data.msgList;
    // 字数动效起点
    var textIndex = 0;
    // 对话列表最后一组数据
    const lastMsgIndex = msgList.length - 1;
    var timer = setInterval(()=>{
      // 回复的内容
      var text = replyContent.substring(0,textIndex);
      textIndex++;
      if(textIndex === 1){
        msgList[lastMsgIndex] = {
          type: 'in',
          content: text,
          avatar:'/public/img/logo/smartai-logo.png',
          result:'success'
        }
        // msgList.push();
      }else{
        msgList[lastMsgIndex].content = text;
      }
      this.setData({
        msgList,
        btnText:'回复中',
        scrollIntoView: 'reply-end', // 滚动到最后一条消息
      });
      // 定时器结束
      // console.log(textIndex === replyContent.length);
      // if(textIndex >= 240){
      if(textIndex >= replyContent.length || textIndex >= 2400){
        clearInterval(timer);
        msgList[lastMsgIndex].content = replyContent;
        // 重新获取次数
        this.getUserInfoNumber();
        this.setData({
          msgList,
          btnDisabled:true,
          btnText:'发送',
        });
        setTimeout(()=>{
          this.setData({
            // 滚动到最后一条消息
            scrollIntoView: 'reply-end'
          });
        },100)
      }
    },100)
  },
  // 回复失败
  replyError(inputVal){
    const msgList = this.data.msgList;
    // 回复的内容
    let replyContent = "服务连接失败，点击重试";
    // 对话列表最后一组数据
    const lastMsgIndex = msgList.length - 1;
    msgList[lastMsgIndex] = {
      type: 'in',
      content: replyContent,
      avatar:'/public/img/logo/smartai-logo.png',
      result:'error',
      inputVal:inputVal,// 原用户输入的文字
    }
    this.setData({
      msgList,
      btnDisabled:true,
      btnText:'发送',
      scrollIntoView: 'reply-end', // 滚动到最后一条消息
    });
    this.getUserInfoNumber();
  },
  // 重发请求
  resendApi(e){
    console.log(e);
    let inputVal = e.currentTarget.dataset.inputVal;
    this.apiChat(inputVal);
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
          title: '已接入最新语言模型，天文地理无所不知',
          path: '/pages/index/index',
        })
      }, 500)
    })
    return {
      title: '已接入最新语言模型，天文地理无所不知',
      path: '/pages/index/index',
      promise 
    }
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
  },
  onKeyboardHeightChange: function (e) {
    // return false;
    console.log('监听软键盘高度变化，更新scroll-view的高度和scrollTop');
    // 监听软键盘高度变化，更新scroll-view的高度和scrollTop
    var self = this;
    var {height} = e.detail;
    console.log(wx.getSystemInfoSync().windowHeight - height);
    const navBarHeight = app.globalData.navBarHeight;
    // const windowHeight = wx.getSystemInfoSync().windowHeight;
    // const inputBottom = navBarHeight + (windowHeight - navBarHeight - 40) / 2;

    const inputBottom = height - navBarHeight >= 0 ? height - navBarHeight :0;
    console.log(navBarHeight);

    self.setData({
      keyboardHeight: inputBottom, // 同步更新data中的keyboardHeight
      // scrollHeight: wx.getSystemInfoSync().windowHeight - height // 更新scroll-view的高度
    });
    // wx.nextTick(function () {
    //   console.log('nextTick');
    //   console.log(self.data.scrollHeight);
    //   wx.pageScrollTo({ // 滚动到底部
    //     scrollTop: self.data.scrollHeight
    //   });
    // });
  },
  closeModal(){
    this.setData({
      showModal:false
    })
  },
})