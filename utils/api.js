import __config from '../config/env'

import activityComments from './comments/activity.js'
import request from './ajax.js'
/**
 * json 转 url字符串 xxx=xxx&xxx=xxx
 * @param {Object} json
 * @returns
 */
const jsonToUrl = (json) => {
  let url = '';
  for (let name in json) {
    url += name + '=' + json[name] + '&';
  }
  url = url.substring(0, url.length - 1);
  return url ? '?' + url : '';
}

module.exports = {
  request,

  // ...activityComments, // 活动-评论相关接口
  // login: (data) => {//小程序登录接口
  //   return request('/weixin/api/ma/wxuser/login', 'post', data, false)
  // },
  wxUserGet: (data) => { //微信用户查询
    return request('/weixin/api/ma/wxuser', 'get', null, false)
  },
  wxUserSave: (data) => { //微信用户新增
    return request('/weixin/api/ma/wxuser', 'post', data, true)
  },
  wxUserPhoneSave: (data) => { //保存用户手机
    return request('/weixin/api/ma/wxuser/saveWxUserPhone', 'post', data, true)
  },

  /**
   * 获取openId
   * @param {Object} data
   * {
   *  token:''
   * } 
   */
  login: (data) => {
    return request('/getOpenId', 'post', data, false)
  },

  /**
   * 请求chatgpt
   * @param {Object} data
   * {
   *  userId:'' // 用户Id, 登录获取的openId
   *  context:'' // 需要询问的问题
   *  chatId:'' // 会话id (首次可不传，后端返回，之后需要传，用于关联上下文)
   * } 
   */
  wxChat: (data) => {
    return request('/chat', 'post', data, false)
  },
  /**
   * 查询用户次数
   * @param {Object} data
   * {
   *  userId:'' // 用户Id
   * } 
   */
  wxUserAccountQueryCount: (data) => {
    return request('/userAccount/queryCount', 'post', data, false)
  },
  /**
   * 次数变更
   * @param {Object} data
   * {
   *  userId:'' // 用户Id
   *  type:'' // pyq(朋友圈) share(分享好友) follow(关注公众号)
   * } 
   */
  wxRechargeUpdateCount: (data) => {
    return request('/recharge/updateCount', 'post', data, true)
  },
  /**
   * 填充用户信息
   * @param {Object} data 
   * {
   * "userId":"xxxxxxx",
   * "userName":"xxxxxxx",
   * "viaUrl":"xxxxxxx",
   * "wechat":"xxxxxxx",
   * "phone":"xxxxxxxx",
   * "gender":1
   * }
   */
  wxPopulateUserInfo: (data) => {
    return request('/populateUserInfo', 'post', data, true)
  },
  /**
   * 查询用户信息接口
   * @param {Object} data 
   * {
   * "userId":"xxxxxxx",
   * }
   */
  wxUserAccountQueryUserInfo: (data) => {
    return request('/userAccount/queryUserInfo', 'post', data, false)
  },
  /**
   * 查询历史聊天记录
   * @param {Object} data 
   * {
   * "userId":"ohTja4q6zWfbmhfyOD6H852uly2w",
   * "content":"你好"
   * }
   */
  wxUserAccountQueryChatHistory: (data) => {
    return request('/userAccount/queryChatHistory', 'post', data, false)
  },
  /**
   * 首页提示语
   */
  wxCallWord: () => {
    return request('/callWord', 'post', null, false)
  },
  /**
   * 查询分享次数信息文案
   * @param {*} data 
   */
  wxUserAccountQueryShareCount: (data) => {
    return request('/userAccount/queryShareCopy', 'post', data, false)
  },
}