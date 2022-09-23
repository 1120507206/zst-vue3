<template>
  <el-menu
    class="index-layout-leftmenu"
    :collapse="collapsed"
    :collapse-transition="false"
    :default-active="defaultActive"
    @select="onMenuSelect"
  >
    <side-menu-item
      v-for="item in newMenuData"
      :key="item.path"
      :route-item="item"
      :top-nav-enable="topNavEnable"
      :belong-top-menu="belongTopMenu"
      :has-tab-nav="hasTabNav"
    />
  </el-menu>
</template>

<script lang="ts">
import { find } from 'lodash-es';
import {
  computed,
  defineComponent,
  PropType,
  toRefs,
  ComputedRef,
} from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { ElMenu } from 'element-plus';
import type { RoutesDataItem } from '@/utils/routes';
import type { StateType as GlobalStateType } from '@/store/global';
import type { StateType as UserStateType } from '@/views/user/store';
import useAddTabNav from '@/composables/useAddTabNav';
import SideMenuItem from './SideMenuItem.vue';

interface SideMenuSetupData {
  newMenuData: ComputedRef<RoutesDataItem[]>;
  onMenuSelect: (path: string) => void;
}

export default defineComponent({
  name: 'SideMenu',

  components: {
    ElMenu,
    SideMenuItem,
  },

  props: {
    collapsed: {
      type: Boolean,
      default: false,
    },
    topNavEnable: {
      type: Boolean,
      default: true,
    },
    belongTopMenu: {
      type: String,
      default: '',
    },
    defaultActive: {
      type: String,
      default: '',
    },
    hasTabNav: {
      type: Boolean,
      default: false,
    },
    menuData: {
      type: Array as PropType<RoutesDataItem[]>,
      default: () => [],
    },
  },
  setup(props): SideMenuSetupData {
    const store = useStore<{
      global: GlobalStateType;
      user: UserStateType;
    }>();
    const { state } = store;
    const router = useRouter();
    const {
      menuData,
      topNavEnable,
    } = toRefs(props);
    const newMenuData = computed<RoutesDataItem[]>(() => {
      if (!topNavEnable.value) {
        return menuData.value as RoutesDataItem[];
      }
      const MenuItems: RoutesDataItem[] = [];
      for (let index = 0, len = menuData.value.length; index < len; index += 1) {
        const element = menuData.value[index];
        if (element.children) {
          MenuItems.push(
            ...element.children as RoutesDataItem[],
          );
        }
      }
      console.log('MenuItems', MenuItems)
      return MenuItems;
    });
  console.log('newMenuData :>> ', newMenuData);
    const onMenuSelect = (path: string) => {
      // 从权限数据里面寻找菜单数据有没有当前需要打开的路径，有就打开新选项卡
      // console.log(' state.user.authList :>> ',  state.user.authList);
      if (state.global.hasTabNav) {
        const currentRouteMenu = find(
          state.user.authList,
          (item) => item.menuUrl === path,
        );
        console.log('currentRouteMenu', currentRouteMenu)
        if (currentRouteMenu) {
          useAddTabNav(store, router, {
            title: currentRouteMenu.menuName,
            path,
          });
        } else {
          console.log('path does not exist in menu data:', path);
        }
      }
    };

    return {
      newMenuData,
      onMenuSelect,
    };
  },
});
</script>
