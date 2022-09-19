<template>
  <div
    id="indexlayout-left"
    :class="{'narrow': collapsed}"
  >
    <div class="indexlayout-left-logo">
      <div
        class="logo-url"
        @click="onLogoClick"
      >
        <img
          v-if="collapsed"
          alt="Vue logo"
          src="../../../assets/images/logo.png"
          width="30"
        >
        <h3
          v-else
          class="logo-title"
        >
         后台管理系统
        </h3>
      </div>
    </div>
    <div class="indexlayout-left-menu">
      <side-menu
        :collapsed="collapsed"
        :top-nav-enable="topNavEnable"
        :belong-top-menu="belongTopMenu"
        :default-active="defaultActive"
        :has-tab-nav="hasTabNav"
        :menu-data="menuData"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import type { RoutesDataItem } from '@/utils/routes';
import type { StateType as GlobalStateType } from '@/store/global';
import type { StateType as UserStateType } from '@/views/user/store';
import useAddTabNav from '@/composables/useAddTabNav';
import SideMenu from './SideMenu.vue';

export default defineComponent({
  name: 'Left',

  components: {
    SideMenu,
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
    hasTabNav: {
      type: Boolean,
      default: false,
    },
    belongTopMenu: {
      type: String,
      default: '',
    },
    defaultActive: {
      type: String,
      default: '',
    },
    menuData: {
      type: Array as PropType<RoutesDataItem[]>,
      default: () => [],
    },
  },

  setup() {
    const store = useStore<{
      global: GlobalStateType;
      user: UserStateType;
    }>();
    const router = useRouter();

    const onLogoClick = () => {
      const hasHomeAuth = store.state.user.authList.find((item) => item.menuUrl === '/home');
      if (hasHomeAuth) {
        useAddTabNav(store, router, {
          title: '首页',
          path: '/home/index',
          notClosable: true,
        });
      }
    };

    return {
      onLogoClick,
    };
  },
});
</script>

<style lang="scss" scoped>
@use '~@/assets/css/global.scss' as global;

#indexlayout-left {
  display: flex;
  flex-direction: column;
  width: global.$leftSideBarWidth;
  height: 100vh;
  background-color: global.$menu-dark-bg;
  color: #c0c4cc;
  transition-duration: 0.1s;

  .indexlayout-left-logo {
    width: 100%;
    height: global.$headerHeight;
    line-height: global.$headerHeight;
    text-align: center;
    vertical-align: middle;

    .logo-url {
      display: inline-block;
      width: 100%;
      height: 100%;
      overflow: hidden;
      cursor: pointer;

      .logo-title {
        display: inline-block;
        margin: 0;
        font-size: 16px;
        font-family: Roboto, sans-serif;
        color: #c0c4cc;
      }
    }

    img {
      vertical-align: middle;
    }
  }

  .indexlayout-left-menu {
    flex: 1;
    overflow: hidden auto;
    // height: calc(100vh);

    .left-scrollbar {
      width: 100%;
      height: 100%;
    }
  }

  &.narrow {
    width: global.$menu-collapsed-width;
  }

  @include global.scrollbar;
}
</style>
