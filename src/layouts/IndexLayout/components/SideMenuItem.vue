<template>
  <template v-if="!item.hidden">
    <template v-if="belongTopMenu !== topMenuPath && topNavEnable === true" />
    <template v-else>
      <!-- eslint-disable-next-line max-len -->
      <template v-if="item.children && Array.isArray(item.children) && hasChildRoute(item.children)">
        <el-sub-menu
          :index="item.path"
          popper-class="index-layout-leftmenu-popper"
        >
          <template #title>
            <Icon
              v-if="item.icon"
              :type="item.icon"
              class="icon"
            />
            <span>{{ item.title }}</span>
          </template>
          <side-menu-item
            v-for="item2 in item.children"
            :key="item2.path"
            :route-item="item2"
            :top-nav-enable="topNavEnable"
            :belong-top-menu="belongTopMenu"
          />
        </el-sub-menu>
      </template>
      <template v-else-if="hasTabNav">
        <a-link :to="item.path">
          <el-menu-item :index="item.path">
            <Icon
              v-if="item.icon"
              :type="item.icon"
              class="icon"
            />
            <template #title>
              {{ item.title }}
            </template>
          </el-menu-item>
        </a-link>
      </template>
      <template v-else>
        <el-menu-item :index="item.path">
          <Icon
            v-if="item.icon"
            :type="item.icon"
            class="icon"
          />
          <template #title>
            {{ item.title }}
          </template>
        </el-menu-item>
      </template>
    </template>
  </template>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  toRefs,
  computed,
  Ref,
  ComputedRef,
} from 'vue';
import {
  ElSubMenu,
  ElMenuItem,
} from 'element-plus';
import {
  RoutesDataItem,
  // setRoutePathForParent,
  getRouteBelongTopMenu,
  hasChildRoute,
} from '@/utils/routes';
import ALink from '@/components/ALink/index.vue';
import Icon from './Icon.vue';

interface ComponentProps {
  routeItem: RoutesDataItem,
  topNavEnable: boolean,
  belongTopMenu: string,
}

interface SideMenuItemSetupData {
  item: Ref;
  topMenuPath: ComputedRef<string>;
  hasChildRoute: (children: RoutesDataItem[]) => boolean;
}

export default defineComponent({
  name: 'SideMenuItem',

  components: {
    ElSubMenu,
    ElMenuItem,
    ALink,
    Icon,
  },

  props: {
    routeItem: {
      type: Object as PropType<ComponentProps['routeItem']>,
      required: true,
    },
    topNavEnable: {
      type: Boolean,
      default: true,
    },
    belongTopMenu: {
      type: String,
      default: '',
    },
    hasTabNav: {
      type: Boolean,
      default: false,
    },
  },

  setup(props: ComponentProps): SideMenuItemSetupData {
    const { routeItem } = toRefs(props);

    const topMenuPath = computed<string>(() => getRouteBelongTopMenu(
      routeItem.value as RoutesDataItem,
    ));

    return {
      item: routeItem,
      topMenuPath,
      hasChildRoute,
    };
  },
});
</script>
