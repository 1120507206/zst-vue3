<template>
  <spin
    v-if="(!isLogin && loading) || !isReady"
    style="height: 200px;"
  />
  <router-view v-if="isLogin" />
</template>

<script lang="ts">
import localforage from 'localforage';
import {
  computed,
  defineComponent,
  onMounted,
  ref,
  Ref,
  ComputedRef,
} from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import Spin from '@/components/Spin/index.vue';
import { StateType as GlobalStateType } from '@/store/global';
// eslint-disable-next-line import/no-cycle
import { StateType as UserStateType, UserInfo } from '@/views/user/store';

interface SecurityLayoutSetupData {
  isLogin: ComputedRef<boolean>;
  loading: Ref<boolean>;
  getUser: () => Promise<void>;
  isReady: Ref<boolean>;
}

export default defineComponent({
  name: 'SecurityLayout',
  components: {
    Spin,
  },
  setup(): SecurityLayoutSetupData {
    const router = useRouter();
    const { state, commit } = useStore<{
      global: GlobalStateType;
      user: UserStateType;
    }>();

    // 获取当前登录用户信息
    const userInfo = computed<UserInfo>(() => state.user.userInfo);

    // 判断是否登录
    const isLogin = computed<boolean>(() => (userInfo.value ? userInfo.value.id !== '' : false));

    // 读取当前用户信息func
    const isReady = ref<boolean>(false); // 是否读取过用户信息
    const loading = ref<boolean>(false);
    const getUser = async () => {
      // loading.value = true;
      const [
        savedUserInfo, // 用户信息
        savedMenuData, // 后台管理菜单信息
        savedAuthList, // 菜单权限信息
      ] = await Promise.all([
        localforage.getItem('userInfo'),
        localforage.getItem('menuData'),
        localforage.getItem('authList'),
      ]);
      console.log('savedMenuData :>> ', savedMenuData);
      console.log('savedAuthList :>> ', savedAuthList);
      commit('user/setUserInfo', savedUserInfo);
      commit('user/setMenuData', savedMenuData);
      commit('user/setAuthList', savedAuthList);

      if (!isLogin.value && router.currentRoute.value.path !== '/user/login') {
        router.replace({
          path: '/user/login',
          query: {
            redirect: router.currentRoute.value.path,
            ...router.currentRoute.value.query,
          },
        });
      }
      // loading.value = false;
      isReady.value = true;
    };

    onMounted(async () => {
      const tabNavString = await localforage.getItem('tabNav');
      const tabNav = JSON.parse(tabNavString as string);
      if (Array.isArray(tabNav) && tabNav.length) {
        commit('global/setTabNav', tabNav);
      }

      getUser();
    });

    return {
      isLogin,
      loading,
      getUser,
      isReady,
    };
  },
});
</script>
