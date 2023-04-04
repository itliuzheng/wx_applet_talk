
const validate = require('./validate.js')

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//空值过滤器
const filterForm = (form) => {
  let obj = {};
  Object.keys(form).forEach(ele => {
    if (!validate.validatenull(form[ele])) {
      obj[ele] = form[ele]
    }
  });
  return obj;
}


const getDoubleTimeSplit = (date) => {
  if(!date) return {};
  let dateArr = date.split('-');
  return {
    year:dateArr[0],
    month:dateArr[1],
    day:dateArr[2],
  }
}
/**
 * 节流加载(采用定时器加时间戳方式)
 * @param {执行时间} delay 
 */
const _throttleLoad = function (delay,fun) {
  var _this = this;
  var timer = null;
  var startTime = Date.now();
  return function () {
    var currentTime = Date.now();
    var remainTime = delay - (currentTime - startTime);
    clearTimeout(timer);
    if (remainTime <= 0) {
      // fun();
      fun.apply(_this,arguments)
      startTime = Date.now();
    } else {
      timer = setTimeout(function () { fun.apply(_this,arguments) }, remainTime);
    }
  }
}

/**
 * 防抖
 * @param {*}} fn 
 * @param {*} interval = 500
 */
function _debounce(fn,delay = 500){
  let timer = null;
	return function(...args) {
		if(timer) {
			clearTimeout(timer);
		} 
		let ctx = this;
		timer = setTimeout(function() {
			timer = null;
			fn.apply(ctx, args);
		}, delay)
	}
}

function formatDate(fmt,date){
  var o = { 
      "Y+" : date.getFullYear().toString(),                 //月份 
      "M+" : date.getMonth()+1,                 //月份 
      "d+" : date.getDate(),                    //日 
      "h+" : date.getHours(),                   //小时 
      "m+" : date.getMinutes(),                 //分 
      "s+" : date.getSeconds(),                 //秒 
      "q+" : Math.floor((date.getMonth()+3)/3), //季度 
      "S"  : date.getMilliseconds()             //毫秒 
  }; 
  if(/(y+)/.test(fmt)) {
          fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length)); 
  }
  for(var k in o) {
      if(new RegExp("("+ k +")").test(fmt)){
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
      }
  }
  return fmt
}

module.exports = {
  formatTime: formatTime,
  formatNumber: formatNumber,
  filterForm: filterForm,
  getDoubleTimeSplit: getDoubleTimeSplit,
  _throttleLoad:_throttleLoad,
  _debounce:_debounce,
  formatDate:formatDate
}
