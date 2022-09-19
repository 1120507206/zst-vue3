import { findIndex } from 'lodash-es';
import type { Store } from 'vuex';
import type { Router } from 'vue-router';
import type { StateType as GlobalStateType, TabNavItem } from '@/store/global';
import type { StateType as UserStateType } from '@/views/user/store';

export default function useAddTabNav(
  store: Store<{
    global: GlobalStateType;
    user: UserStateType;
  }>,
  router: Router,
  tabNavItem: TabNavItem,
): void {
  // console.log(store);
  const { state, commit } = store;

  if (state.global.hasTabNav) {
    const { tabNavData } = state.global;
    const index = findIndex(tabNavData, (item) => item.path === tabNavItem.path);
    if (index === -1) {
      commit('global/addTabNav', tabNavItem);
      commit('global/setSelectedTabNavIndex', state.global.tabNavData.length - 1);
    } else {
      commit('global/setSelectedTabNavIndex', index);
    }
  }
  router.replace(tabNavItem.path);
}
