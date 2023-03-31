



function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//时间工具
var dateUtil = {
  getMessageTime(time) {
    const messageTime = new Date(time);
    const now = new Date();
    const messageYear = messageTime.getFullYear();
    const messageMonth = messageTime.getMonth() + 1;
    const messageDate = messageTime.getDate();
    const messageHour = formatNumber(messageTime.getHours());
    const messageMinute = formatNumber(messageTime.getMinutes());
  
    // 判断是否是同一年
    if (messageYear === now.getFullYear()) {
      // 判断是否是同一天
      if (
        messageMonth === now.getMonth() + 1 &&
        messageDate === now.getDate()
      ) {
        return `${messageHour}:${messageMinute}`;
      }
      // 判断是否是昨天
      if (
        messageMonth === now.getMonth() + 1 &&
        messageDate === now.getDate() - 1
      ) {
        return `昨天 ${messageHour}:${messageMinute}`;
      }
      // 判断是否是本周
      const firstDayOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 1);
      const lastDayOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 7);
      if (
        messageTime >= firstDayOfWeek &&
        messageTime <= lastDayOfWeek
      ) {
        const daysOfWeek = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        return `${daysOfWeek[messageTime.getDay()]} ${messageHour}:${messageMinute}`;
      }
      // 不满足以上条件，返回“月日时分”格式
      return `${messageMonth}月${messageDate}日 ${messageHour}:${messageMinute}`;
    } else {
      // 不满足以上条件，返回“年月日时分”格式
      return `${messageYear}年${messageMonth}月${messageDate}日 ${messageHour}:${messageMinute}`;
    }
  }
}
module.exports = {//暴露接口调用
  getMessageTime: dateUtil.getMessageTime,
}