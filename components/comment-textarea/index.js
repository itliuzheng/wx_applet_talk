var app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showModal:{
      type:Boolean,
      value:false
    },
    title:{
      type: String,
      value: '写读后感'
    },
    placeholder:{
      type: String,
      value: '分享一下你的读后感…'
    },
    storageKey:{
      type: String,
      value:'article-input-value'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    commentFocus:false,
    content:null,
    textareaHeight: 300
  },
  attached(){
  },
  //监听
  observers:{
    "showModal":function(value) {
      let _this = this;
      if(value){
        setTimeout(function() {
          let content = null;
          try {
            content = wx.getStorageSync(_this.properties.storageKey);
          } catch (e) {

          }
          console.log(content);
          _this.setData({
            commentFocus:value,
            content:content
          })
        },50)
      }
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {

    closeFun:function(event) {
      this.setData({
        commentFocus:false
      })
      this.triggerEvent('close');
    },
    commentInput:function(event) {
      
      let { value } = event.detail;

      wx.setStorage({
        key: this.properties.storageKey,
        data: null
      })
      this.triggerEvent('input',value.content);
    },
    textareaInput(e){
      let {value} = e.detail;
      wx.setStorage({
        key: this.properties.storageKey,
        data: value
      })
    },
    commentReturnForm:function(e) {
      // console.log("阻止");
    },
    // 获取键盘高度
    getkeyboardheight:function(event) {
      let { value, height } = event.detail;
      // console.log('键盘高度---',height);
      // comment-form
      // var dialoghpx = height / 750 * wx.getSystemInfoSync().windowWidth;
      // console.log(dialoghpx);
      // setTimeout(()=>{
        // wx.createSelectorQuery 自定义组件内需要  。in(this)
        let query = wx.createSelectorQuery().in(this);
        query.select('.comment-content').boundingClientRect(rect=>{
          let clientHeight = rect.height;
          this.setData({
            textareaHeight: clientHeight - height
          })
        }).exec();
      // },300)
    },
    blurkeyboardheight(){
      let query = wx.createSelectorQuery().in(this);
      query.select('.comment-content').boundingClientRect(rect=>{
        let clientHeight = rect.height;
        this.setData({
          textareaHeight: clientHeight
        })
      }).exec();
    }
  }
})
