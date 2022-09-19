/**
 * 站点配置
 * @author LiQingSong
 */
export interface SettingsType {
  /**
   * 站点名称
   */
  siteTitle: string;

  /**
   * 顶部菜单开启
   */
  topNavEnable: boolean;

  /**
   * 头部固定开启
   */
  headFixed: boolean;

  /*
  * 启用面包屑
  * */
  hasBreadcrumb: boolean;

  /*
  * 启用选项卡式导航
  * */
  hasTabNav: boolean;

  /**
   * 站点本地存储Token 的 Key值
   */
  siteTokenKey: string;

  /**
   * Ajax请求头发送Token 的 Key值
   */
  ajaxHeadersTokenKey: string;

  /**
   * Ajax返回值不参加统一验证的api地址
   */
  ajaxResponseNoVerifyUrl: string[];

  /**
   * iconfont.cn 项目在线生成的 js 地址
   */
  iconfontUrl: string[];
}

const settings: SettingsType = {
  siteTitle: '后台管理系统',
  topNavEnable: false,
  headFixed: true,
  hasBreadcrumb: false,
  hasTabNav: true,
  siteTokenKey: 'tk',
  ajaxHeadersTokenKey: 'x-token',
  ajaxResponseNoVerifyUrl: [
    '/login', // 用户登录
  ],
  iconfontUrl: [
    '//at.alicdn.com/t/font_2777647_gi7bx89qyrw.js',
  ],
};

export default settings;
