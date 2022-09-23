<template>

  <div class="tab-nav">
    <ElTabs
      v-model="selectedIndex"
      type="card"
      class="tab-nav__tabs"
      @tab-click="onClickTab"
      @tab-remove="onDeleteTab"
    >
      <ElTabPane
        v-for="(item, index) in tabData"
        :key="index"
        :label="item.title"
        :closable="!Boolean(item.notClosable)"
        :name="String(index)"
      />
    </ElTabs>
    <ElCard
      v-if="tabData.length"
      class="tab-nav__card"
    >
      <router-view v-slot="{ Component }">
        <keep-alive max="5">
          <div style="min-height:76vh">
            <component :is="Component" />
          </div>
        </keep-alive>
      </router-view>
    </ElCard>
  </div>
</template>

<script lang="ts">
import { findIndex } from 'lodash-es';
import {
  defineComponent,
  ref,
  computed,
  watch,
  ComputedRef,
  Ref,
  onMounted,
} from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';
import {
  ElTabs,
  ElTabPane,
  ElCard,
} from 'element-plus';
import type { StateType as GlobalStateType } from '@/store/global';
import type { StateType as UserStateType } from '@/views/user/store';
import useDeleteTabNav from '@/composables/useDeleteTabNav';

interface ComponentSetupData {
  tabData: ComputedRef<GlobalStateType['tabNavData']>;
  selectedIndex: Ref<string>;
  onClickTab: () => void;
  onDeleteTab: (index: string) => void;
}

export default defineComponent({
  name: 'TabNav',

  components: {
    ElTabs,
    ElTabPane,
    ElCard,
  },

  setup(): ComponentSetupData {
    const router = useRouter();
    const route = useRoute();
    const store = useStore<{
      global: GlobalStateType,
      user: UserStateType;
    }>();
    const { state, commit } = store;

    const selectedIndex = ref('0');

    const setSelectedIndex = (path: string) => {
      const index = findIndex(state.global.tabNavData, (navItem) => navItem.path === path);
      selectedIndex.value = String(index);
      commit('global/setSelectedTabNavIndex', index);
    };

    const onClickTab = () => {
      const tabNavItem = state.global.tabNavData[Number(selectedIndex.value)];
      setSelectedIndex(tabNavItem.path);
      router.replace(tabNavItem.path);
    };

    const onDeleteTab = () => {
    console.log('1')
      useDeleteTabNav(store, router, { path: route.path });
    };

    onMounted(() => {
      setSelectedIndex(route.path);
    });

    watch(() => state.global.selectedTabNavIndex, (val: number) => {
      selectedIndex.value = String(val);
    });

    return {
      tabData: computed(() => state.global.tabNavData),
      selectedIndex,
      onClickTab,
      onDeleteTab,
    };
  },
});
</script>

<style lang="scss" scoped>
.tab-nav {
  &__tabs {
    background: #fff;

    &::v-deep .el-tabs__header {
      margin-bottom: 0;
    }
  }

  &__card {
    margin: 16px;
  }
}
</style>
