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
    placeholder:{
      type: String,
      value: '写下你此刻的想法…'
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    commentFocus:false,
    content:null
  },
  attached(){
  },
  //监听
  observers:{
    "showModal":function(value) {
      let _this = this;
      if(value){
        setTimeout(function() {
          _this.setData({
            commentFocus:value,
            content:null
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
      //判断是否登录
      console.log(!app.isLogin());
      if(!app.isLogin()){
        wx.navigateTo({
          url: "/pages/user-phone/index"
        });
        return false;
      }
      let { value } = event.detail;
      this.triggerEvent('input',value.content);
    },
    commentForm:function(e) {
      // console.log("阻止");
    },
  }
})
