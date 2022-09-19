<template>
  <div
    id="indexlayout-right-top"
    :class="{'topNavEnable': !topNavEnable }"
  >
    <div class="indexlayout-right-top-top">
      <div
        class="indexlayout-flexible"
        @click="() => {
          if(toggleCollapsed) {
            toggleCollapsed();
          }
        }"
      >
        <i
          v-if="collapsed"
          class="el-icon-s-unfold"
        />
        <i
          v-else
          class="el-icon-s-fold"
        />
      </div>
      <div class="indexlayout-top-menu">
        <div
          ref="topMenuCon"
          :style="{width: topMenuWidth}"
        >
          <template v-if="topNavEnable">
            <template v-for="(item, key) in menuData">
              <a-link
                v-if="!item.hidden"
                :key="key"
                :to="item.path"
                :class="{'active': belongTopMenu === item.path }"
                class="indexlayout-top-menu-li"
              >
                {{ item.title }}
              </a-link>
            </template>
          </template>
          <bread-crumbs
            v-else-if="hasBreadcrumb"
            class="breadcrumb"
            :list="breadCrumbs"
          />
        </div>
      </div>
      <div class="indexlayout-top-menu-right">
        <right-top-message />

        <right-top-user />

        <!--        <select-lang class="indexlayout-top-selectlang" />-->
      </div>
    </div>
    <div
      v-if="topNavEnable"
      class="indexlayout-right-top-bot"
    >
      <div class="indexlayout-right-top-bot-home">
        <i class="el-icon-s-home" />
      </div>
      <bread-crumbs
        v-if="hasBreadcrumb"
        class="breadcrumb"
        :list="breadCrumbs"
      />
    </div>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  PropType,
  Ref,
  toRefs,
} from 'vue';
import { BreadcrumbType, RoutesDataItem } from '@/utils/routes';
import BreadCrumbs from '@/components/BreadCrumbs/index.vue';
// import SelectLang from '@/components/SelectLang/index.vue';
import ALink from '@/components/ALink/index.vue';
import RightTopMessage from './RightTopMessage.vue';
import RightTopUser from './RightTopUser.vue';
import useTopMenuWidth from '../composables/useTopMenuWidth';

interface ComponentProps {
  collapsed: boolean,
  topNavEnable: boolean,
  hasBreadcrumb: boolean,
  hasTabNav: boolean,
  belongTopMenu: string,
  toggleCollapsed: () => void,
  breadCrumbs: BreadcrumbType[],
  menuData: RoutesDataItem[],
}

interface RightTopSetupData {
  topMenuCon: Ref;
  topMenuWidth: Ref;
}

export default defineComponent({
  name: 'RightTop',
  components: {
    ALink,
    BreadCrumbs,
    RightTopMessage,
    RightTopUser,
    // SelectLang,
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
    hasBreadcrumb: {
      type: Boolean,
      default: true,
    },
    hasTabNav: {
      type: Boolean,
      default: true,
    },
    belongTopMenu: {
      type: String,
      default: '',
    },
    toggleCollapsed: {
      type: Function as PropType<ComponentProps['toggleCollapsed']>,
      default() {
        return () => {
          //
        };
      },
    },
    breadCrumbs: {
      type: Array as PropType<ComponentProps['breadCrumbs']>,
      default: () => [],
    },
    menuData: {
      type: Array as PropType<ComponentProps['menuData']>,
      default: () => [],
    },
  },
  setup(props: ComponentProps): RightTopSetupData {
    const { topNavEnable } = toRefs(props);

    const {
      topMenuCon,
      topMenuWidth,
    } = useTopMenuWidth(topNavEnable);

    return {
      topMenuCon,
      topMenuWidth,
    };
  },
});
</script>

<style lang="scss">
@use '~@/assets/css/global.scss' as global;
@import '~@/assets/css/element-variables.scss';

#indexlayout-right-top {
  width: 100%;
  height: (global.$headerHeight + global.$headerBreadcrumbHeight);
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  z-index: 9;

  .indexlayout-right-top-top {
    display: flex;
    width: 100%;
    height: global.$headerHeight;
    background-color: global.$menu-dark-bg;
    color: #c0c4cc;

    .indexlayout-flexible {
      width: global.$headerHeight;
      height: global.$headerHeight;
      line-height: global.$headerHeight;
      text-align: center;
      cursor: pointer;

      &:hover {
        background-color: global.$menu-dark-submenu-bg;
        color: global.$menu-dark-highlight-color;
      }
    }

    .indexlayout-top-menu {
      height: global.$headerHeight;
      line-height: global.$headerHeight;
      flex: 1;
      /* display: flex; */
      overflow: hidden;
      overflow-x: auto;

      .indexlayout-top-menu-li {
        display: inline-block;
        padding: 0 15px;
        height: (global.$headerHeight - 3);
        text-decoration: none;
        color: #c0c4cc;
        font-size: 15px;
        border-bottom: solid 3px transparent;

        &:hover,
        &.active {
          background-color: global.$menu-dark-submenu-bg;
          color: global.$menu-dark-highlight-color;
          border-bottom-color: $--color-primary; // 想使用@use避免重复引入，但是--这种变量是作为private处理不导出的，还是躲不开
        }
      }

      .breadcrumb {
        line-height: global.$headerHeight;
      }
    }

    .indexlayout-top-menu-right {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 45px;
      width: 200px;

      .indexlayout-top-usermenu {
        padding-left: 10px;
        color: #c0c4cc;
      }

      .indexlayout-top-selectlang {
        padding-left: 10px;

        .dropDown {
          i {
            font-size: 16px;
            color: #c0c4cc;
          }
        }
      }
    }

    @include global.scrollbar();
  }

  .indexlayout-right-top-bot {
    display: flex;
    width: 100%;
    height: global.$headerBreadcrumbHeight;
    background-color: global.$mainBgColor;

    .indexlayout-right-top-bot-home {
      width: global.$headerBreadcrumbHeight;
      height: global.$headerBreadcrumbHeight;
      line-height: global.$headerBreadcrumbHeight;
      text-align: center;
    }

    .breadcrumb {
      line-height: global.$headerBreadcrumbHeight;
      margin-left: 10px;
    }
  }

  &.topNavEnable {
    height: global.$headerHeight;

    .indexlayout-right-top-top {
      background-color: #ffffff;
      color: $--color-text-primary;

      .indexlayout-flexible {
        &:hover {
          background-color: global.$mainBgColor;
          color: global.$heading-color;
        }
      }

      .indexlayout-top-menu-right {
        .indexlayout-top-message {
          color: global.$heading-color;
        }

        .indexlayout-top-usermenu {
          color: global.$heading-color;
        }

        .indexlayout-top-selectlang {
          .dropDown {
            i {
              color: global.$heading-color;
            }
          }
        }
      }
    }
  }
}
</style>
