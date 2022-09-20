<template>
  <div id="indexlayout">
    <left
      :collapsed="collapsed"
      :top-nav-enable="topNavEnable"
      :belong-top-menu="belongTopMenu"
      :default-active="defaultActive"
      :has-tab-nav="hasTabNav"
      :menu-data="permissionMenuData"
    />

    <div
      id="indexlayout-right"
      :class="{ 'fixed-header': headFixed }"
    >
      <right-top
        :collapsed="collapsed"
        :top-nav-enable="topNavEnable"
        :belong-top-menu="belongTopMenu"
        :toggle-collapsed="toggleCollapsed"
        :bread-crumbs="breadCrumbs"
        :has-breadcrumb="hasBreadcrumb"
        :menu-data="permissionMenuData"
      />

      <div class="indexlayout-right-main">
        <template v-if="!hasTabNav">
          <permission :roles="routeItem.roles">
            <router-view />
          </permission>
        </template>
        <template v-else>
          <tab-nav />
        </template>
        <right-footer />
      </div>
    </div>

    <!--    <settings />-->
  </div>
</template>

<script lang="ts">
import localforage from 'localforage';
import {
  defineComponent,
  computed,
  onMounted,
  ComputedRef,
} from 'vue';
import { useStore } from 'vuex';
import {
  useRoute,
  // useRouter,
} from 'vue-router';
import type { StateType as GlobalStateType, TabNavItem } from '@/store/global';
// eslint-disable-next-line import/no-cycle
import type { StateType as UserStateType } from '@/views/user/store';
import {
  vueRoutes,
  RoutesDataItem,
  getRouteItem,
  getSelectLeftMenuPath,
  formatRoutePathTheParents,
  getRouteBelongTopMenu,
  getBreadcrumbRoutes,
  BreadcrumbType,
  // getPermissionMenuData,
} from '@/utils/routes';
import useTitle from '@/composables/useTitle';
import Permission from '@/components/Permission/index.vue';
// import useAddTabNav from '@/composables/useAddTabNav';
import IndexLayoutRoutes from './routes';
import Left from './components/Left.vue';
import RightTop from './components/RightTop.vue';
import RightFooter from './components/RightFooter.vue';
// import Settings from './components/Settings.vue';
import TabNav from './components/TabNav.vue';
// import TabNav from './components/RightTabNav.vue';

interface IndexLayoutSetupData {
  collapsed: ComputedRef<boolean>;
  toggleCollapsed: () => void;
  topNavEnable: ComputedRef<boolean>;
  hasBreadcrumb: ComputedRef<boolean>;
  hasTabNav: ComputedRef<boolean>;
  belongTopMenu: ComputedRef<string>;
  headFixed: ComputedRef<boolean>;
  defaultActive: ComputedRef<string>;
  breadCrumbs: ComputedRef<BreadcrumbType[]>;
  permissionMenuData: ComputedRef<RoutesDataItem[]>;
  routeItem: ComputedRef<RoutesDataItem>;
}

export default defineComponent({
  name: 'IndexLayout',

  components: {
    Permission,
    Left,
    RightTop,
    RightFooter,
    // Settings,
    TabNav,
  },

  setup(): IndexLayoutSetupData {
    const store = useStore<{
      global: GlobalStateType;
      user: UserStateType;
    }>();
    // const router = useRouter();
    const route = useRoute();

    // 所有菜单路由
    const menuData: RoutesDataItem[] = vueRoutes(store.state.user.authList, IndexLayoutRoutes);
    console.log('menuData', store.state.user.authList, IndexLayoutRoutes, menuData);

    // 当前路由 item
    const routeItem = computed<RoutesDataItem>(() => getRouteItem(route.path, menuData));

    // // 有权限的菜单
    // const permissionMenuData = computed<RoutesDataItem[]>(() => getPermissionMenuData(
    //   store.state.user.currentUser.roles,
    //   menuData,
    // ));
    // 当前系统的菜单是在后端返回的，与本系统整合的话，暂时最靠谱的办法是比对后端返回的菜单，与前端菜单整合
    const permissionMenuData = computed<RoutesDataItem[]>(() => menuData);

    // 当前路由的顶部菜单path
    const belongTopMenu = computed<string>(() => getRouteBelongTopMenu(routeItem.value));

    // 当前路由的父路由path[]
    const routeParentPaths = computed<string[]>(() => formatRoutePathTheParents(
      routeItem.value.path,
    ));

    // 收缩左侧
    const collapsed = computed<boolean>(() => store.state.global.collapsed);
    const toggleCollapsed = (): void => {
      store.commit('global/changeLayoutCollapsed', !collapsed.value);
    };

    // 右侧顶部导航是否开启
    const topNavEnable = computed<boolean>(() => store.state.global.topNavEnable);

    // 是否启用面包屑
    const hasBreadcrumb = computed<boolean>(() => store.state.global.hasBreadcrumb);

    // 是否启用选项卡式导航
    const hasTabNav = computed<boolean>(() => store.state.global.hasTabNav);

    // 右侧顶部是否固定
    const headFixed = computed<boolean>(() => store.state.global.headFixed);

    // 左侧选择的菜单
    const defaultActive = computed<string>(() => getSelectLeftMenuPath(routeItem.value));

    // 面包屑导航
    const breadCrumbs = computed<BreadcrumbType[]>(() => getBreadcrumbRoutes(
      routeItem.value,
      routeParentPaths.value,
      menuData,
    ));

    // 设置title
    useTitle(routeItem);

    onMounted(async () => {
      const tabNavDataStr = await localforage.getItem('tabNav') as string;
      const tabNavData: TabNavItem[] = JSON.parse(tabNavDataStr);
      if (tabNavData && !tabNavData.length) {
        // useAddTabNav(store, router, {
        //   title: '首页',
        //   path: '/home/index',
        // });
      }
    });

    return {
      collapsed,
      toggleCollapsed,
      topNavEnable,
      hasBreadcrumb,
      hasTabNav,
      belongTopMenu,
      headFixed,
      defaultActive,
      breadCrumbs,
      permissionMenuData,
      routeItem,
    };
  },
});
</script>

<style lang="scss">
@use '~@/assets/css/variables.scss' as variables;

#indexlayout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

#indexlayout-right {
  position: relative;
  flex: 1;
  overflow: auto;
  background-color: variables.$mainBgColor;
  min-width: 1200px;
  &.fixed-header {
    display: flex;
    flex-direction: column;

    .indexlayout-right-main {
      flex: 1;
      overflow: auto;
    }
  }
}

.indexlayout-main-content {
  margin: 24px;
  position: relative;
}
</style>
