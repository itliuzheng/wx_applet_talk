// components/scroll-y/scroll-y.js
var current = 0; //默认当前页面为第0页

Component({
  options: {
    multipleSlots: true //开启多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    //scroll-view视图容器高度
    height: {
      type: String,
      value: "0px"
    },
    //竖向滚动条位置
    scrollTop: {
      type: Number,
      value: 0
    },
    //自定义下拉刷新阈值(单位：px)
    refresherThreshold: {
      type: Number,
      value: 100
    },
    //自定义下拉刷新区域背景颜色
    refresherBackground: {
      type: String,
      value: "#f6f6f6"
    },
    //下拉刷新状态(false表示未被下拉，true表示被下拉)
    refresherTriggered: {
      type: Boolean,
      value: false
    },
    //下拉样式(可取值为：cricle-progress、diy)
    pullStyle: {
      type: String,
      value: "circle-progress"
    },
    //刷新样式(可取值:circle、clock、diy)
    refreshStyle: {
      type: String,
      value: "circle"
    },
    //下拉提示
    pullTip: {
      type: String,
      value: "下拉刷新"
    },
    //释放提示
    releaseTip: {
      type: String,
      value: "释放刷新"
    },
    //刷新提示
    refreshTip: {
      type: String,
      value: "正在刷新中"
    },
    //提示字体颜色
    tipTextColor:{
      type:String,
      value:"#b2b2b2"
    },
    //是否开启加载更多(默认不开启)
    loadMore: {
      type: Boolean,
      value: false
    },
    //是否显示加载动画
    showLoading: {
      type: Boolean,
      value: false
    },
    //加载样式
    loadStyle: {
      type: String,
      value: "circle"
    },
    //加载提示
    loadTip: {
      type: String,
      value: "正在加载中"
    },
    //加载背景
    loadBackground: {
      type: String,
      value: "#f6f6f6"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    canRelease: false, //是否可以释放刷新
    isRefreshing: false //标识是否刷新
  },
  /**
   * 组件生命周期
   */
  lifetimes: {
    attached: function () {
      var throttleLoad = this._throttleLoad(2000);
      this.setData({
        throttleLoad: throttleLoad
      });
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //下拉
    onPulling: function (event) {
      var p = Math.min(event.detail.dy / this.data.refresherThreshold, 1);
      this._modifyTip(p);
      switch (this.data.pullStyle) {
        case "circle-progress":
          this._circlrProgress(p);
          break;
        case "diy":
          this.triggerEvent("refresherpulling", {
            dy: event.detail.dy
          }, {});
          break;
      }
    },
    //刷新
    onRefresh: function (event) {
      this.setData({
        isRefreshing: true,
        refresherTriggered: true
      });
      this.triggerEvent("refresherrefresh", { dy: event.detail.dy }, {});
      //复位
      setTimeout(() => {
        this.setData({
          refresherTriggered: false
        });
      }, 3000);
    },
    //复位
    onRestore: function () {
      this._restore();
      this.triggerEvent("refresherresotre", {}, {});
    },
    //终止
    onAbort: function () {
      this._restore();
      this.triggerEvent("refresherabort", {}, {});
    },
    //圆环进度
    _circlrProgress: function (p) {
      if (p <= 0.5) {
        this.animate('.right-circle', [{
          rotate: 135 + p * 360
        }], 0);
      } else {
        this.animate('.right-circle', [{ rotate: 315 }], 0); //防止下拉过快，右边圈不完整
        this.animate('.left-circle', [{
          rotate: 135 + (p - 0.5) * 360
        }], 0);
      }
    },
    //修改提示
    _modifyTip: function (p) {
      var canRelease = false;
      if (p == 1) {
        canRelease = true;
      }
      this.setData({
        canRelease: canRelease
      });
    },
    //复位
    _restore: function () {
      this.setData({
        isRefreshing: false
      });
      switch (this.data.pullStyle) {
        case "circle-progress":
          this._circleProgressRestore();
          break;
        case "diy":
          break;
      }
    },
    //圆环进度复位
    _circleProgressRestore: function () {
      this.animate(".left-circle", [{
        rotate: 135
      }], 0);
      this.animate(".right-circle", [{
        rotate: 135
      }], 0);
    },
    /**
     * 上拉加载相关函数
     */
    //开始触摸
    _onTouchStart: function (event) {
      var _this = this;
      var touchStartY = event.touches[0].clientY; //记录触摸开始位置
      _this.createSelectorQuery().select(".scroll-y").fields({
        size: true,
        scrollOffset: true
      }, (result) => {
        _this.setData({
          scrollViewHeight: result.height, //scoll-view容器高度(单位为px)
          scrollHeight: result.scrollHeight,
          touchStartY: touchStartY
        });
      }).exec();
    },
    //触摸移动
    onTouchMove: function (event) {
      this._getScrollInfo(event.touches[0].clientY);
    },
    //触摸结束
    onTouchEnd: function (event) {
      this._getScrollInfo(event.changedTouches[0].clientY);
    },
    /**
     * 获取当前scroll-view的scrollTop值
     * 用来判断是否加载
     */
    _getScrollInfo: function (touchEndY) {
      var _this = this;
      _this.createSelectorQuery().select(".scroll-y").fields({
        scrollOffset: true
      }, (result) => {
        _this.setData({
          nowScrollTop: result.scrollTop
        }, () => {
          _this._isLoad(touchEndY);
        });
      }).exec();
    },
    //是否加载
    _isLoad: function (touchEndY) {
      var touchStartY = this.data.touchStartY; //开始触摸时候的位置
      var nowScrollTop = this.data.nowScrollTop; //当前的scrollTop值
      var scrollHeight = this.data.scrollHeight; //scroll-view容器内高度
      var height = this.data.scrollViewHeight; //scoll-view容器高度
      var loadMore = this.data.loadMore; //是否开启加载
      if (loadMore && touchEndY < touchStartY && (scrollHeight - nowScrollTop - height < 50)) {
        this.setData({
          showLoading: true
        });
        this.data.throttleLoad();
      }
    },
    /**
     * 节流加载(采用定时器加时间戳方式)
     * @param {执行时间} delay 
     */
    _throttleLoad: function (delay) {
      var _this = this;
      var timer = null;
      var startTime = Date.now();
      return function () {
        var currentTime = Date.now();
        var remainTime = delay - (currentTime - startTime);
        clearTimeout(timer);
        if (remainTime <= 0) {
          _this.loadMore();
          startTime = Date.now();
        } else {
          timer = setTimeout(function () { _this.loadMore() }, remainTime);
        }
      }
    },
    /**
     * 加载更多
     */
    loadMore: function () {
      current += 1;
      this.triggerEvent("loadmore", { current, current }, {});
    }
  }
})