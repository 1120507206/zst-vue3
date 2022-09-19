import { findIndex } from 'lodash-es';
import type { Store } from 'vuex';
import type { Router } from 'vue-router';
import type { StateType as GlobalStateType, TabNavItem } from '@/store/global';
import type { StateType as UserStateType } from '@/views/user/store';

export default function useDeleteTabNav(
  store: Store<{
    global: GlobalStateType;
    user: UserStateType;
  }>,
  router: Router,
  tabNavItem: Partial<TabNavItem>,
): void {
  // console.log(store);
  const { state, commit } = store;

  if (state.global.hasTabNav) {
    const { tabNavData } = state.global;
    const index = findIndex(
      tabNavData,
      (item) => item.path === tabNavItem.path || item.title === tabNavItem.title,
    );
    console.log('delete index', index);
    const newIndex = index === 0 ? 0 : index - 1;
    if (index !== -1) {
      commit('global/setSelectedTabNavIndex', newIndex);
      commit('global/deleteTabNav', index);
    }
    router.replace(tabNavData[newIndex].path);
  }
}
