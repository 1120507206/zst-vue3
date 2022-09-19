<template>
  <div class="main-conent-screen">
    <div
      v-if="$slots.header"
      class="screen-header"
    >
      <slot name="header" />
    </div>
    <div
      v-else
      class="screen-padding"
    />

    <div
      ref="contentRef"
      class="screen-conent"
    >
      <el-table
        v-loading="loading"
        :height="tableHeight"
        :row-key="rowKey"
        :data="data"
        :show-header="showHeader"
        :stripe="stripe"
        :border="border"
        :size="size"
        :class="tableClass"
        :header-row-class-name="headerRowClassName"
      >
        <slot />
        <template #empty>
          <slot
            v-if="$slots.empty"
            name="empty"
          />
          <span v-else>暂无数据</span>
        </template>
      </el-table>
    </div>

    <div
      v-if="pagination"
      class="screen-footer"
    >
      <el-pagination
        background
        :layout="pagination.layout || 'prev, pager, next'"
        :current-page="pagination.current"
        :page-size="pagination.pageSize"
        :total="pagination.total"
        @current-change="pagination.onChange"
      />
    </div>
    <div
      v-else
      class="screen-padding"
    />
  </div>
</template>
<script lang="ts">
import { debounce } from 'lodash-es';
import {
  defineComponent,
  ref,
  onBeforeUnmount,
  onMounted,
  PropType,
} from 'vue';
import {
  ElTable,
  ElPagination,
} from 'element-plus';
import { PaginationConfig } from './data.d';

export default defineComponent({
  name: 'ScreenTable',

  components: {
    ElTable,
    ElPagination,
  },

  props: {
    rowKey: {
      type: String,
      default: '',
    },
    data: {
      type: Array,
      default() {
        return [];
      },
    },
    loading: {
      type: Boolean,
      default: false,
    },
    pagination: {
      type: Object as PropType<PaginationConfig | false | undefined>,
      default: undefined,
    },
    showHeader: {
      type: Boolean,
      default: true,
    },
    stripe: {
      type: Boolean,
      default: true,
    },
    border: {
      type: Boolean,
      default: true,
    },
    size: {
      type: String,
      default: 'small',
    },
    tableClass: {
      type: String,
      default: 'custom-table',
    },
    headerRowClassName: {
      type: String,
      default: 'custom-table-header',
    },
  },

  setup() {
    const contentRef = ref<HTMLDivElement>();
    const tableHeight = ref<number>(200);

    const resizeHandler = debounce(() => {
      if (contentRef.value) {
        tableHeight.value = contentRef.value.offsetHeight;
      }
    }, 100);

    onMounted(() => {
      resizeHandler();

      window.addEventListener('resize', resizeHandler);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', resizeHandler);
    });

    return {
      contentRef,
      tableHeight,
    };
  },
});
</script>
<style lang="scss" scoped>
.main-conent-screen {
  display: flex;
  flex-direction: column;
  height: calc(100% - 48px - 50px);
  border-radius: 4px;
  background-color: #fff;
  .screen-header {
    padding: 20px;
    min-height: 33px;
  }
  .screen-footer {
    padding: 20px;
    min-height: 32px;
    text-align: right;
  }
  .screen-conent {
    flex: 1;
    padding: 0 20px;
    overflow: hidden;
  }
  .screen-padding {
    padding-top: 20px;
  }

}
</style>
