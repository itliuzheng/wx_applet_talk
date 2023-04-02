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
    scrollIntoView: '', // 滚动到的位置
    inputVal: '', // 输入框内容
    chatGPT:null,
    messageTime: '',// 回复时间显示逻辑
    btnDisabled:true,// 按钮是否置灰状态
    btnText:'发送', //按钮文字
    canUseCount:0, //可用次数
    chatId:null, // 会话id (首次可不传，后端返回，之后需要传，用于关联上下文)
    // btnText:'回复中', //按钮文字
  },

  // 页面加载时，初始化 ChatGPT
  onLoad() {
    // 获取 ChatGPT 实例
    // this.chatGPT = OpenAI.createInstance({
    //   engine: 'davinci', // 使用 Davinci 引擎
    //   apiKey: '您的 API Key',
    // });
    this.getInfo();
  },
  // 初始化，获取对话信息
  getInfo(){
    app.initPage()
    .then(()=>{
      this.getUserInfoNumber();
    })
    setTimeout(()=>{
      let msgList = this.data.msgList;
      if(this.data.msgList.length === 0){
        msgList.push({
          type: 'in',
          content: '你好，我是SMARTAI，最聪明的智能机器人，已接入最新的语言模型，虽然接口付费，但我每天都会为你提供3次免费机会，首次登录可+3次，分享好友+3次，分享朋友圈+3次',
          avatar:'/public/img/logo/smartai-logo.png',
          result:'success'
        })
      }
      let time = msgList[msgList.length - 1].time;
      this.setData({
        messageTime:getMessageTime(time?time:new Date()),
        msgList,
        scrollIntoView: `msg-item-${this.data.msgList.length - 1}`, // 滚动到最后一条消息
      })
    },500)
  },
  // 获取用户次数
  getUserInfoNumber(){
    // app.openid()
    console.log(1);
    console.log(app.globalData.wxUser);
    app.api.wxUserAccountQueryCount({
      userId : app.globalData.wxUser.openid
    }).then(res=>{
      console.log(res);
      this.setData({
        canUseCount:res.data
      })
    })
    .catch(()=>{
      console.log('fail');
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
    console.log(inputVal);

    // 将用户输入加入对话列表
    const msgList = this.data.msgList;
    msgList.push({
      type: 'out',
      content: inputVal,
      avatar:'/public/img/logo/smartai-logo.png',
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
      scrollIntoView: `msg-item-${msgList.length - 1}`, // 滚动到最后一条消息
    });

    this.apiChat(inputVal);
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
    // 回复的内容
    // let replyContent = "你好，我是SMARTAI，最聪明的智能机器人，你可以问我任何问题，上至天文下至地理，我将知无不言言无不尽";
    // 字数动效起点
    var textIndex = 0;
    // 对话列表最后一组数据
    const lastMsgIndex = msgList.length - 1;

    var timer = setInterval(()=>{
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
        scrollIntoView: `msg-item-${msgList.length - 1}`, // 滚动到最后一条消息
      });
      // 定时器结束
      console.log(textIndex === replyContent.length);
      if(textIndex === replyContent.length){
        clearInterval(timer);
        // 重新获取次数
        this.getUserInfoNumber();
        this.setData({
          btnDisabled:true,
          btnText:'发送',
        });
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
      scrollIntoView: `msg-item-${msgList.length - 1}`, // 滚动到最后一条消息
    });
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
})