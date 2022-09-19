import { findIndex } from 'lodash-es';

export default function useAddTabNav(store, router, tabNavItem) {
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
// # sourceMappingURL=useAddTabNav.js.map
