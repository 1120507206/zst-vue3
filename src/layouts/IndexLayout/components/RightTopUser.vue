<template>
  <el-dropdown @command="onMenuClick">
    <a
      class="indexlayout-top-usermenu ant-dropdown-link"
      @click="e => e.preventDefault()"
    >
      {{ currentUser.name }}
      <i class="el-icon-arrow-down el-icon--right" />
    </a>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          command="userinfo"
          disabled
        >
          个人信息
        </el-dropdown-item>
        <el-dropdown-item command="changePwd">
          修改密码
        </el-dropdown-item>
        <el-dropdown-item command="logout">
          退出
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts">
import { find } from 'lodash-es';
import { computed, defineComponent, ComputedRef } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import {
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
} from 'element-plus';
import type { StateType as GlobalStateType } from '@/store/global';
import { StateType as UserStateType, UserInfo } from '@/views/user/store';
import useAddTabNav from '@/composables/useAddTabNav';

interface RightTopUserSetupData {
  currentUser: ComputedRef<UserInfo>;
  onMenuClick: (command: string) => Promise<void>;
}

export default defineComponent({
  name: 'RightTopUser',

  components: {
    ElDropdown,
    ElDropdownMenu,
    ElDropdownItem,
  },

  setup(): RightTopUserSetupData {
    const store = useStore<{
      global: GlobalStateType;
      user: UserStateType
    }>();
    const { state, commit, dispatch } = store;
    const router = useRouter();

    // 获取当前登录用户信息
    const currentUser = computed<UserInfo>(() => state.user.userInfo);

    // 点击菜单
    const onMenuClick = async (command: string) => {
      if (command === 'logout') {
        commit('global/clearTabNav');
        const res: boolean = await dispatch('user/logout');
        if (res) {
          router.replace({
            path: '/user/login',
            query: {
              redirect: router.currentRoute.value.path,
              ...router.currentRoute.value.query,
            },
          });
        }
      } else if (command === 'changePwd') {
        // router.push('/home/changePwd');
        const path = '/home/changePwd';
        console.log(state.global);
        // 从权限数据里面寻找菜单数据有没有当前需要打开的路径，有就打开新选项卡
        if (state.global.hasTabNav) {
          // const currentRouteMenu = find(
          //   state.global.tabNavData,
          //   (item) => item.path === path,
          // );
          // if (!currentRouteMenu) {
          useAddTabNav(store, router, {
            title: '修改密码',
            path,
          });
          // } else {
          //   console.log('path does not exist in menu data:', path);
          // }
        }
      }
    };

    return {
      currentUser,
      onMenuClick,
    };
  },
});
</script>
