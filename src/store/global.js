import localforage from 'localforage';
import settings from '@/config/settings';

const initState = {
  collapsed: false,
  topNavEnable: settings.topNavEnable,
  hasBreadcrumb: settings.hasBreadcrumb,
  hasTabNav: settings.hasTabNav,
  tabNavData: [],
  selectedTabNavIndex: 0,
  headFixed: settings.headFixed,
};
const StoreModel = {
  namespaced: true,
  name: 'global',
  state: {
    ...initState,
  },
  mutations: {
    changeLayoutCollapsed(state, payload) {
      state.collapsed = payload;
    },
    setTopNavEnable(state, payload) {
      state.topNavEnable = payload;
    },
    setHasBreadcrumb(state, payload) {
      state.hasBreadcrumb = payload;
    },
    setHeadFixed(state, payload) {
      state.headFixed = payload;
    },
    //#region 选项卡导航相关
    setHasTabNav(state, payload) {
      state.hasTabNav = payload;
    },
    setTabNav(state, payload) {
      state.tabNavData = payload;
    },
    setSelectedTabNavIndex(state, payload) {
      state.selectedTabNavIndex = payload;
    },
    addTabNav(state, tabNav) {
      state.tabNavData = state.tabNavData.concat(tabNav);
      localforage.setItem('tabNav', JSON.stringify(state.tabNavData));
    },
    deleteTabNav(state, index) {
      state.tabNavData.splice(index, 1);
      localforage.setItem('tabNav', JSON.stringify(state.tabNavData));
    },
    clearTabNav(state) {
      state.tabNavData = [];
      localforage.setItem('tabNav', JSON.stringify([]));
    },
  },
  actions: {},
};
export default StoreModel;
// # sourceMappingURL=global.js.map
