
import __config from '../config/env'

import activityComments from './comments/activity.js'
import request from './ajax.js'
/**
 * json 转 url字符串 xxx=xxx&xxx=xxx
 * @param {Object} json
 * @returns
 */
const jsonToUrl =  (json) => {
	let url = '';
	for (let name in json) {
		url += name + '=' + json[name] + '&';
	}
	url = url.substring(0, url.length - 1);
	return url ? '?'+ url : '';
}

module.exports = {
  request,

  ...activityComments, // 活动-评论相关接口
  login: (data) => {//小程序登录接口
    return request('/weixin/api/ma/wxuser/login', 'post', data, false)
  },
  limitUser: (data) => {//查询普通用户限制信息
    return request('/weixin/api/yd/limit/getConfig', 'get', data, false)
  },
  wxUserGet: (data) => {//微信用户查询
    return request('/weixin/api/ma/wxuser', 'get', null, false)
  },
  wxUserSave: (data) => {//微信用户新增
    return request('/weixin/api/ma/wxuser', 'post', data, true)
  },
  wxUserPhoneSave: (data) => {//保存用户手机
    return request('/weixin/api/ma/wxuser/saveWxUserPhone', 'post', data, true)
  },
  /**
   * 小程序首页分页查询
   * @param {String} data
   */
  wxHomePage: (data) => {
    return request(`/weixin/api/yd/home/page?${data}`, 'get', null, false)
  },
  /**
   * 获取文章详情接口
   * @param {String} sectionId
   */
  wxHomeArticleSectionDetail: (sectionId) => {
    return request(`/weixin/api/yd/home/articleSection/detail/${sectionId}`, 'get', null, true)
  },
  /**
   * 设置已读
   * @param {String} sectionId
   */
  wxSectionReaded: (sectionId) => {
    return request('/weixin/api/yd/section/readed', 'post', {sectionId}, false)
  },
  /**
   * 阅读打卡
   * @param {String} sectionId
   */
  wxSectionClockin: (sectionId) => {
    return request('/weixin/api/yd/section/clockin', 'post', {sectionId}, true)
  },
  /**
   * 查询读书活动详细信息
   * @param {String} id 
   */
  wxReadActivityDetail: (id) => {
    return request(`/weixin/api/yd/readActivity/detail/${id}`, 'get', null, false)
  },
  /**
   * 查询读书活动分页列表
   * @param {Object} data {"pageNum": 0, "pageSize": 0}
   */
  wxReadActivityPage: (data) => {
    return request(`/weixin/api/yd/readActivity/page`, 'post', data, false)
  },
  /**
   * 新增意见反馈
   * @param {Object} data {"content": "string"}
   */
  wxFeedbackAdd: (data) => {
    return request(`/weixin/api/yd/feedback/add`, 'post', data, true)
  },
  /**
   * 个人中心接口 - 查询我喜欢的书
   * @param {Object} data {
                            "isAsc": "string",
                            "orderBy": "string",
                            "orderByColumn": "string",
                            "pageNum": 0,
                            "pageSize": 0
                          }
   */
  wxPersonalCenterGetMyLoveBook: (data) => {
    return request(`/weixin/api/yd/personal/center/getMyLoveBook`, 'post', data, true)
  },
  /**
   * 个人中心接口 - 查询我关注的书的详情
   * @param { Number } bookId
   */
  wxPersonalCenterGetMyLoveBookDetail: (bookId) => {
    // return request(`/weixin/api/yd/personal/center/getMyLoveBookDetail/${bookId}`, 'post', '', true)
    return request(`/weixin/api/yd/personal/center/getMyLoveBookDetail?bookId=${bookId}`, 'post', '', true)
  },
  /**
   * 个人中心接口 - 查询我喜欢的书评
   * @param {Object} data {
                            "isAsc": "string",
                            "orderBy": "string",
                            "orderByColumn": "string",
                            "pageNum": 0,
                            "pageSize": 0
                          }
   */
  wxPersonalCenterGetMyLoveComments: (data) => {
    return request(`/weixin/api/yd/personal/center/getMyLoveComments`, 'post', data, true)
  },
  /**
   * 个人中心接口 - 查询我喜欢的文章
   * @param {Object} data {
                            "isAsc": "string",
                            "orderBy": "string",
                            "orderByColumn": "string",
                            "pageNum": 0,
                            "pageSize": 0
                          }
   */
  wxPersonalCenterGetMyLoveSection: (data) => {
    return request(`/weixin/api/yd/personal/center/getMyLoveSection`, 'post', data, false)
  },
  /**
   * 取消关注书
   * @param {String} bookId 
   */
  wxBookCancel: (bookId) => {
    return request(`/weixin/api/yd/book/cancel/${bookId}`, 'post', null, true)
  },
  /**
   * 关注书
   * @param {String} bookId 
   */
  wxBookConcern: (bookId) => {
    return request(`/weixin/api/yd/book/concern/${bookId}`, 'post', null, true)
  },
  /**
   * 查询个人中心用户的统计信息
   */
  getPersonalCenterGetPersonCenterStatistic: (data) => {
    return request(`/weixin/api/yd/personal/center/getPersonCenterStatistic`, 'get', '', false)
  },
  /**
   * 获取消息分页列表接口
   * @param { Object}
   * {
        "isAsc": "string",
        "orderBy": "string",
        "orderByColumn": "string",
        "pageNum": 0,
        "pageSize": 0
      }
   */
  postNoticePage: (data) => {
    return request(`/weixin/api/yd/notice/page`, 'post', data, true)
  },
  /**
   * 获取点赞消息分页列表接口
   * @param {*} data 
   */
  postPraisePage: (data) => {
    return request(`/weixin/api/yd/notice/getPraisePage`, 'post', data, true)
  },
  /**
   * 生成小程序二维码
   * @param {*} data 
   */
  postQrcode: (data) => {
    return request(`/weixin/api/ma/qrcode/getQrcode`, 'post', data, false)
  },
  /**
   * 查询花园分页列表
   * @param {*} data 
   */
  postGardenPage: (data) => {
    return request(`/weixin/api/yd/garden/page`, 'post', data, false)
  },
  /**
   * 查询分享图片
   * @param {*} data 
   */
  getShareImgs: (data) => {
    return request(`/weixin/api/yd/shareImg/getShareImgs`, 'get', data, true)
  },
  /**
   * 获取登录用户对文章的状态
   * @param {*} sectionId 
   */
  getSectionStatusByUser: (sectionId) => {
    return request(`/weixin/api/yd/section/getSectionStatusByUser/${sectionId}`, 'get', null, false)
  },
  /**
   * 获取日历
   * @param {*} year 
   */
  getSectionGetCalendar: (year) => {
    return request(`/weixin/api/yd/section/getCalendar?year=${year}`, 'get', null, false)
  },
  /**
   * 获取可以查询的年份
   */
  getSectionGetYears: () => {
    return request(`/weixin/api/yd/section/getYears`, 'get', null, false)
  },
  /**
   * 随机获取一条鼓励短语对象
   */
  getMotivational: () => {
    return request(`/weixin/api/yd/motivational/getMotivational`, 'get', null, false)
  },
  /**
   * 随机获取一条打卡图片
   */
  getShareImgGetClockShareImgs: () => {
    return request(`/weixin/api/yd/shareImg/getClockShareImgs`, 'get', null, false)
  },
  /**
   * 记录点击视频浏览的数据
   */
  postSectionAddViewCountById: (sectionId) => {
    return request(`/weixin/api/yd/section/addViewCount/${sectionId}`, 'post', null, false)
  },
  /**
   * 获取系统消息分页列表接口
   */
  postNoticeGetSyspage: (data) => {
    return request(`/weixin/api/yd/notice/getSyspage`, 'post', data, false)
  },
  /**
   * 查询我的阅读笔记
   */
  postPersonalCenterGetReadNotes: (data) => {
    return request(`/weixin/api/yd/personal/center/getReadNotes`, 'post', data, false)
  },
  /**
   * 查询我的阅读笔记详情
   * @param {Object} data {
                            "bookId": "string",
                            "isAsc": "string",
                            "orderBy": "string",
                            "orderByColumn": "string",
                            "pageNum": 0,
                            "pageSize": 0
                          }
   */
  postPersonalCenterGetReadNotesDetail: (data) => {
    return request(`/weixin/api/yd/personal/center/getMyComments`, 'post', data, false)
  },
  /**
   * 获取系统消息未读数量
   */
  postNoticeGetSysCount: () => {
    return request(`/weixin/api/yd/notice/getSysCount`, 'post', null, false)
  },
  /**
   * 查询赞和回复未读数量
   */
  getPraiseCommentsNoReadCount: () => {
    return request(`/weixin/api/yd/notice/getPraiseCommentsNoReadCount`, 'get', null, false)
  },
  /**
   * 查询评论未读数量
   */
  getCommentsNoReadCount: () => {
    return request(`/weixin/api/yd/notice/getCommentsNoReadCount`, 'get', null, false)
  },
  /**
   * 查询赞未读数量
   */
  getPraiseCount: () => {
    return request(`/weixin/api/yd/notice/getPraiseCount`, 'get', null, false)
  },
  /**
   * 查询通知总的未读数量
   */
  postNoticeGetAllCount: () => {
    return request(`/weixin/api/yd/notice/getTotalNoReadCount`, 'get', null, false)
  },
  /**
   * 设置已读
   */
  postNoticeGetSysSetRead: (noticeId) => {
    return request(`/weixin/api/yd/notice/setRead?noticeId=${noticeId}`, 'post', null, false)
  },
  /**
   * 设置点赞已读
   */
  postNoticeSetAllPraiseRead: () => {
    return request(`/weixin/api/yd/notice/setAllPraiseRead`, 'post', null, false)
  },
  /**
   * 查询领读计划分页列表
   * @param {*} data 
   */
  postInviteGetInviteRecords: (data) => {
    return request(`/weixin/api/yd/invite/getInviteRecords`, 'post', data, false)
  },
  /**
   * 查询小程序投票活动信息
   * @param {*} data 
   */
  geVoteGetVoteActivity: () => {
    return request(`/weixin/api/yd/vote/getVoteActivity`, 'get', null, false)
  },
  /**
   * 投票接口
   * @param {*} data 
   */
  postAddVoteCount: (data) => {
    return request(`/weixin/api/yd/vote/addVoteCount`, 'post', data, false)
  },
  /**
   * 查询当天的打卡图片
   */
  getCurrentDayImg: () => {
    return request(`/weixin/api/yd/clockinImg/getCurrentDayImg`, 'get', null, false)
  },
  /**
   * 查询用户交易记录列表
   */
  postGetTradeRecords: (data) => {
    return request(`/weixin/api/yd/personal/center/getTradeRecords`, 'post', data, false)
  },
  /**
   * 获取书的分页列表
   */
  postBookList: (data) => {
    return request(`/weixin/api/yd/book/list`, 'post', data, false)
  },
  /**
   * 查询邀请好友配置信息
   */
  getInviteConfig: () => {
    return request(`/weixin/api/yd/invite/getInviteConfigImg`, 'get', null, false)
  },
  /**
   * 订单相关-购买月读会员
   * @type data
   */
  postMaOrderInfo: (data) => {
    return request(`/weixin/api/ma/orderinfo`, 'post', data, false)
  },
  
}