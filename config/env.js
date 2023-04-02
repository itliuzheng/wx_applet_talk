// 获取当前帐号信息
const accountInfo = wx.getAccountInfoSync();
const env = accountInfo.miniProgram.envVersion;
if (!env) {
console.error("获取运行环境失败!");
}
const baseApi = {
  // 开发版
  develop: "https://xp666.fun",
  // develop: "https://www.yuedu.love/api",
  // 体验版
  trial: "",
  // 正式版
  release: ""
};

export default {
  //服务器地址，即后台服务的访问地址；本地开发填http://localhost:7500即可，如果要用真机调试要把localhost换成局域网ip，手机和电脑要处于同一局域网中
  env,
  // basePath: 'https://www.yuedu.love/api',
  basePath: baseApi[env] || baseApi.release, //测试环境
  //广告配置，小程序流量主：https://mp.weixin.qq.com/wxopen/frame
  //广告开关（true/false）
  adEnable: false,
  //Banner广告ID
  adBannerID: '',
  //插屏广告ID
  adInsertScreenID: '',
  //激励式广告ID
  adIncentiveID: '',
}