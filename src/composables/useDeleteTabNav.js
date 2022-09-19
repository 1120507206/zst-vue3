import { findIndex } from 'lodash-es';

export default function useDeleteTabNav(store, router, tabNavItem) {
  // console.log(store);
  const { state, commit } = store;
  if (state.global.hasTabNav) {
    const { tabNavData } = state.global;
    const index = findIndex(tabNavData, (item) => item.path === tabNavItem.path || item.title === tabNavItem.title);
    console.log('delete index', index);
    const newIndex = index === 0 ? 0 : index - 1;
    if (index !== -1) {
      commit('global/setSelectedTabNavIndex', newIndex);
      commit('global/deleteTabNav', index);
    }
    router.replace(tabNavData[newIndex].path);
  }
}
// # sourceMappingURL=useDeleteTabNav.js.map
