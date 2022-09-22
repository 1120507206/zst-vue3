import { flatMapDeep } from 'lodash-es';
import { Mutation, Action } from 'vuex';
import md5 from 'blueimp-md5';
import localforage from 'localforage';
import { ElMessage } from 'element-plus';
import { RoutesDataItem } from '@/utils/routes';
import { StoreModuleType } from '@/utils/store';
import { setToken, removeToken } from '@/utils/localToken';
import { login, getUserMenu, logout } from '@/views/user/service';
import { ReqParams, ResResult } from '@/views/user/data.d';

export interface UserInfo {
  id: string;
  userId: string;
  account: string;
  name: string;
  email: string;
  org: {
    id: string,
    name: string,
  },
}

export interface Auth {
  type: '',
}

export interface StateType {
  userInfo: UserInfo,
  menuData: RoutesDataItem[],
  authList: ResResult.MenuItem[],
}

export interface ModuleType extends StoreModuleType<StateType> {
  state: StateType;
  mutations: {
    setUserInfo: Mutation<StateType>;
    setMenuData: Mutation<StateType>;
    setAuthList: Mutation<StateType>;
  };
  actions: {
    login: Action<StateType, StateType>;
    fetchMenuData: Action<StateType, StateType>;
    logout: Action<StateType, StateType>;
  };
}

const initState: StateType = {
  userInfo: {
    id: '',
    userId: '',
    account: '',
    name: '',
    email: '',
    org: {
      id: '',
      name: '',
    },
  },
  menuData: [],
  authList: [],
};

const StoreModel: ModuleType = {
  namespaced: true,
  name: 'user',
  state: {
    ...initState,
  },
  mutations: {
    setUserInfo(state, payload: StateType['userInfo']) {
      state.userInfo = payload;
    },
    setMenuData(state, payload: StateType['menuData']) {
      state.menuData = payload;
    },
    setAuthList(state, payload: StateType['authList']) {
      state.authList = payload;
    },
  },
  actions: {
    async login({ dispatch, commit }, params: ReqParams.Login) {
      try {
        const { data: { success, obj, message } } = await login({
          ...params,
          userPass: md5(params.userPass),
        });
        if (success) {
          const userInfo = {
            id: obj.userIdentityId,
            userId: obj.userId,
            account: obj.account,
            name: obj.userName,
            email: obj.email,
            org: {
              id: obj.curOrgId,
              name: obj.curOrgName,
            },
          };
          commit('setUserInfo', userInfo);
          await localforage.setItem('userInfo', userInfo); // 本地缓存

          setToken(obj.tk);
          await dispatch('fetchMenuData');
          return true;
        }
        ElMessage.error(message);
        return false;
      } catch (e) {
        console.log(e);
        return false;
      }
    },

    async fetchMenuData({ commit }) {
      try {
        const { data: { success, obj, message } } = await getUserMenu();
        // console.log('fetchMenuData', obj, flatMapDeep(obj, (item: ResResult.MenuItem) => {
        //   let result = [item];
        //
        //   if (Array.isArray(item.children) && item.children.length) {
        //     result = result.concat(item.children);
        //   }
        //
        //   return result;
        // }));
        if (success) {
          // 目前系统设计，菜单数据和权限数据是混一起的，需要把菜单数据打平，把权限相关信息提出来作为authList缓存起来，便于后续处理
          const menuData = obj;
          const authList = flatMapDeep(obj, (item: ResResult.MenuItem) => {
            let result = [item];

            if (Array.isArray(item.children) && item.children.length) {
              result = result.concat(item.children);
            }

            return result;
          });
          // console.log(11111111111111, authList);
          commit('setMenuData', menuData);
          commit('setAuthList', authList);
          await localforage.setItem('menuData', menuData); // 本地缓存
          await localforage.setItem('authList', authList); // 本地缓存
          return true;
        }
        ElMessage.error(message);
        return false;
      } catch (e) {
        return false;
      }
    },

    async logout({ commit }) {
      try {
        const { data: { success } } = await logout();
        if (success) {
          await removeToken();
          commit('setUserInfo', { ...initState.userInfo });
          return true;
        }
        return false;
      } catch (error) {
        return false;
      }
    },
  },
};

export default StoreModel;
