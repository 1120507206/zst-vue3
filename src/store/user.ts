// import { Mutation, Action } from 'vuex';
// import md5 from 'blueimp-md5';
// import { StoreModuleType } from '@/utils/store';
// // import { queryCurrent, queryMessage } from '@/services/user';
// import { removeToken } from '@/utils/localToken';
// import { login, getUserMenu, logout } from '@/views/user/service';
// import { ResponseData } from '@/shims-vue.d';
// import { ReqParams } from '@/views/user/data.d';
//
// export interface CurrentUser {
//   id: number;
//   name: string;
//   avatar: string;
//   roles: string[];
// }
//
// export interface StateType {
//   currentUser: CurrentUser;
//   message: number;
// }
//
// export interface ModuleType extends StoreModuleType<StateType> {
//   state: StateType;
//   mutations: {
//     setIserInfo: Mutation<StateType>;
//     saveMessage: Mutation<StateType>;
//   };
//   actions: {
//     // fetchCurrent: Action<StateType, StateType>;
//     // fetchMessage: Action<StateType, StateType>;
//     login: Action<StateType, StateType>;
//     fetchMenuData: Action<StateType, StateType>;
//     logout: Action<StateType, StateType>;
//   };
// }
//
// const initState: StateType = {
//   currentUser: {
//     id: 0,
//     name: '',
//     avatar: '',
//     roles: [],
//   },
//   message: 0,
// };
//
// const StoreModel: ModuleType = {
//   namespaced: true,
//   name: 'user',
//   state: {
//     ...initState,
//   },
//   mutations: {
//     saveCurrentUser(state, payload) {
//       state.currentUser = {
//         ...initState.currentUser,
//         ...payload,
//       };
//     },
//     saveMessage(state, payload) {
//       state.message = payload;
//     },
//   },
//   actions: {
//     // async fetchCurrent({ commit }) {
//     //   try {
//     //     const response: ResponseData = await queryCurrent();
//     //     const { data } = response;
//     //     commit('saveCurrentUser', data || {});
//     //     return true;
//     //   } catch (error) {
//     //     return false;
//     //   }
//     // },
//     // async fetchMessage({ commit }) {
//     //   try {
//     //     const response: ResponseData = await queryMessage();
//     //     const { data } = response;
//     //     commit('saveMessage', data || 0);
//     //     return true;
//     //   } catch (error) {
//     //     return false;
//     //   }
//     // },
//     async login({ commit }, params: ReqParams.Login) {
//       try {
//         const { data: { success, obj, message } } = await login({
//           ...params,
//           userPass: md5(params.userPass),
//         });
//         if (success) {
//           commit('saveCurrentUser', {
//
//           });
//           return true;
//         }
//         return false;
//       } catch (e) {
//         return false;
//       }
//     },
//
//     async fetchMenuData({ commit }) {
//
//     },
//
//     async logout({ commit }) {
//       try {
//         const { data: { success } } = await logout();
//         if (success) {
//           await removeToken();
//           commit('saveCurrentUser', { ...initState.currentUser });
//           return true;
//         }
//         return false;
//       } catch (error) {
//         return false;
//       }
//     },
//   },
// };
//
// export default StoreModel;
