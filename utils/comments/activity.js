
import request from '../ajax'
// 活动类评论
module.exports = {
  /**
   * 新增评论
   * @param {Object} data  {"articleSectionId": 0,"content": "string","parentId": 0}
   */
  wxReadActivityCommentsAdd: (data) => {
    return request('/weixin/api/yd/read/activity/comments/add', 'post', data, true)
  },
  /**
   * 删除评论
   * @param {String} id
   */
  wxReadActivityCommentsDel: (id) => {
    return request(`/weixin/api/yd/read/activity/comments/del/${id}`, 'post', null, true)
  },
  /**
   * 查询一级评论分页列表
   * @param {String} data 
    {
      "articleSectionId": 0,
      "isAsc": "string",
      "orderBy": "string",
      "orderByColumn": "string",
      "pageNum": 0,
      "pageSize": 0
    }
   */
  wxReadActivityCommentsGetTopLevelPage: (data) => {
    return request(`/weixin/api/yd/read/activity/comments/getTopLevelPage`, 'post', data, true)
  },
  /**
   * 给评论点赞
   * @param {String} commentsId 
   */
  wxReadActivityCommentsPraiseId: (commentsId,isLoad = true) => {
    return request(`/weixin/api/yd/read/activity/comments/praise/${commentsId}`, 'post', null, isLoad)
  },
  /**
   * 取消评论点赞
   * @param {String} commentsId 
   */
  wxReadActivityCommentsPraiseCancelId: (commentsId) => {
    return request(`/weixin/api/yd/read/activity/comments/praise/cancel/${commentsId}`, 'post', null, false)
  },
  /**
   * 查询回复列表
   * @param {String} parentId 
   */
  wxReadActivityCommentsGetReplyList: (parentId) => {
    return request(`/weixin/api/yd/read/activity/comments/getReplyList/${parentId}`, 'get', null, true)
  },
  /**
   * 新版查询回复列表
   * @param {Object} data 
   */
  wxReadActivityCommentsPostReplyList: (data) => {
    return request(`/weixin/api/yd/read/activity/comments/replyList`, 'post', data, false)
  },
  /**
   * 查询点赞评论的用户分页列表
   * @param {Object} {commentId,pageNum,pageSize} 
   */
  wxReadActivityCommentsGetPraiseCommentUsers: (data) => {
    return request(`/weixin/api/yd/read/activity/comments/getPraiseCommentUsers?commentId=${data.commentId}&pageSize=${data.pageSize}&pageNum=${data.pageNum}`, 'post', null, false)
  },
  /**
   * 给活动点赞
   * @param {String} sectionId 
   */
  wxReadActivityPraiseId: (readActivityId) => {
    return request(`/weixin/api/yd/readActivity/praise/${readActivityId}`, 'post', null, false)
  },
  /**
   * 活动取消点赞
   * @param {String} sectionId 
   */
  wxReadActivityPraiseCancelId: (readActivityId) => {
    return request(`/weixin/api/yd/readActivity/praise/cancel/${readActivityId}`, 'post', null, false)
  },
}