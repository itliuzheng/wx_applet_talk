let timed = null;
var app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item:{

    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isClick:false,
    disabled:false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 点击投票
     */
    clickVote(e){
      let { id } = e.currentTarget.dataset;
      if(this.data.disabled) return false;
      // wx.showToast({
      //   title: '今日投票次数已用完请明日再来',
      //   icon:'none',
      // })

      app.api.postAddVoteCount({id})
      .then(res=>{
        if(timed){
          clearTimeout(timed);
          this.setData({
            isClick:false,
            disabled:false
          })
        }
  
        this.setData({
          isClick:true,
          disabled:true
        })
        timed = setTimeout(()=>{
          this.setData({
            isClick:false,
            disabled:false
          })
        },1000)
        this.triggerEvent('voteSuccess')
      })
      .catch(err=>{

      })

    }
  }
})
