import localforage from 'localforage';
import { Mutation/* , Action */ } from 'vuex';
import { StoreModuleType } from '@/utils/store';
import settings from '@/config/settings';

export interface TabNavItem {
  title: string;
  path: string;
  notClosable?: boolean;
}

export interface StateType {
  // 左侧展开收起
  collapsed: boolean;

  // 顶部菜单开启
  topNavEnable: boolean;

  // 启用面包屑
  hasBreadcrumb: boolean;

  // 启用选项卡
  hasTabNav: boolean;

  // 选项卡数据
  tabNavData: TabNavItem[];

  // 当前选项卡index
  selectedTabNavIndex: number;

  // 头部固定开启
  headFixed: boolean;
}

export interface ModuleType extends StoreModuleType<StateType> {
  state: StateType;
  mutations: {
    changeLayoutCollapsed: Mutation<StateType>;
    setTopNavEnable: Mutation<StateType>;
    setHasBreadcrumb: Mutation<StateType>;
    setHeadFixed: Mutation<StateType>;

    //#region 选项卡导航相关
    setHasTabNav: Mutation<StateType>;
    setTabNav: Mutation<StateType>;
    setSelectedTabNavIndex: Mutation<StateType>;
    addTabNav: Mutation<StateType>;
    deleteTabNav: Mutation<StateType>;
    clearTabNav: Mutation<StateType>;
    //#endregion
  };
  actions: {
  };
}

const initState: StateType = {
  collapsed: false,
  topNavEnable: settings.topNavEnable,
  hasBreadcrumb: settings.hasBreadcrumb,
  hasTabNav: settings.hasTabNav,
  tabNavData: [],
  selectedTabNavIndex: 0,
  headFixed: settings.headFixed,
};

const StoreModel: ModuleType = {
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
    //#endregion
  },
  actions: {},
};

export default StoreModel;
