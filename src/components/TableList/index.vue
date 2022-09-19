<template>
  <div>
    <ElRow
      v-if="enableSearch && fromItem && fromItem.length"
      class="main__header"
      justify="end"
    >
      <ElCol :span="leftSpan">
        <ElForm
          inline
          :model="searchFrom"
          label-width="5em"
        >
          <ElFormItem
            v-for="(it, idx) in fromItem"
            :key="idx"
            :label="it.text"
            :label-width="it.width"
          >
            <ElInput
              v-if="it.type === 'input'"
              v-model="searchFrom[it.prop]"
              :placeholder="it.placeholder"
              clearable
            />
          </ElFormItem>
        </ElForm>
      </ElCol>
      <ElCol
        class="main__header-buttons"
        :span="rightSpan"
      >
        <ElButton
          type="primary"
          @click="onSearch"
        >
          查询
        </ElButton>
        <ElButton
          type="default"
          @click="onReset"
        >
          重置
        </ElButton>
        <!-- <ElButton
          :disabled="!canDelALL"
          @click="onDelByCheckBox"
        >
          删除选中
        </ElButton> -->
        <ElButton
          v-for="(bt, bt_idx) in searchBtns"
          :key="bt_idx"
          :type="bt.type"
          @[bt.handle.eventType]="bt.handle.fn"
        >
          {{ bt.text }}
        </ElButton>
      </ElCol>
    </ElRow>
    <ElTable
      border
      :data="tableData"
      class="main__body"
      @selection-change="selectionChange"
    >
      <ElTableColumn
        v-for="(it, idx) in column"
        :key="idx"
        :type="it.type"
        :label="it.label"
        :align="it.align"
        :prop="it.prop"
        show-overflow-tooltip
        :min-width="it.minWidth"
        :width="it.width"
      >
        <template
          v-if="it.btns && it.btns.length"
          #default="{ row,$index }"
        >
          <ElSpace>
            <ElButton
              v-for="(btn, btn_idx) in it.btns"
              :key="btn_idx"
              type="text"
              :size="btn.size"
              @click="btn.click(row, $index)"
            >
              {{ btn.text }}
            </ElButton>
          </ElSpace>
        </template>
      </ElTableColumn>
    </ElTable>
    <div class="pagination">
      <ElPagination
        v-model:page="pagination.pageIndex"
        v-model:limit="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
        @current-change="onCurrentChange"
        @size-change="onSizeChange"
      />
    </div>
    <ElDialog v-model="formVisited">
      <span>This is a message</span>
    </ElDialog>
  </div>
</template>

<script lang="ts">
/* @typescript-eslint/no-explicit-any */
import {
  defineComponent, PropType, reactive, ref, onMounted, watch,
} from 'vue';
import {
  ElButton, ElTable, ElTableColumn, ElPagination, ElSpace, ElForm, ElFormItem, ElInput, ElRow, ElCol, ElDialog,
} from 'element-plus';
import type { FormItemRule } from 'element-plus/lib/el-form/src/form.type';

interface IBtns {
  size?: string;
  text: string;
  click?: (row: unknown, index: number) => void;
}

export interface IColumn {
  type?: 'selection' | 'index' | 'expand';
  label?: string;
  align?: 'center' | 'left' | 'right';
  prop?: string;
  minWidth?: string;
  width?: string;
  btns?: IBtns[];
}
export interface IfromItem {
  type?: 'select' | 'input';
  text: string;
  align?: 'center' | 'left' | 'right';
  width?: string;
  placeholder?: string;
  prop: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectOpt?: any; // 当 type = select
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  change?: (val: any) => void;
}

interface IRules {
  [propName: string]: FormItemRule;
}

interface IFormConfigItem {
  form: IfromItem[];
  rules?: IRules;
}

export interface IFormConfig {
  [propName: string]: IFormConfigItem;
}

interface ComponentProps {
  facth: () => void;
  config: {
    column: IColumn[];

    search?: {
      leftSpan?: number;
      rightSpan?: number;
      fromItem: IfromItem[];
      btns: IBtns[];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      searchFrom: any;
    };
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

export default defineComponent({
  components: {
    ElButton,
    ElTable,
    ElTableColumn,
    ElPagination,
    ElSpace,
    ElForm,
    ElFormItem,
    ElInput,
    ElRow,
    ElCol,
    ElDialog,
  },
  props: {
    config: {
      type: Object as PropType<ComponentProps['config']>,
      default() {
        return {};
      },
    },
    facth: {
      type: Function as PropType<ComponentProps['facth']>,
      default: () => [],
    },
    data: {
      type: [Array],
      default() {
        return [];
      },
    },
  },
  setup(props: ComponentProps) {
    const pagination = reactive({ pageIndex: 1, pageSize: 10, total: 1 });

    const tableData = ref();

    watch(() => props.data, (cur) => {
      console.log(cur, 1111111111);
      tableData.value = cur;
    });

    const column = ref(props.config.column);

    const enableSearch = ref(!!props.config.search);

    const searchFrom = props.config.search ? reactive(props.config.search.searchFrom) : reactive({});
    const fromItem = props.config.search ? ref(props.config.search.fromItem) : ref([]);
    const searchBtns = props.config.search ? ref(props.config.search.btns) : ref([]);
    const leftSpan = props.config.search ? ref(props.config.search.leftSpan) : ref(18);
    const rightSpan = props.config.search ? ref(props.config.search.rightSpan) : ref(6);

    const selectionChange = () => {
      //
    };

    const onCurrentChange = () => {
      //
    };

    const onSizeChange = () => {
      //
    };
    const onSearch = () => {
      console.log('onSearch', searchFrom);
      //
    };

    const onReset = () => {
      //
      const keys = Object.keys(searchFrom);
      for (let i = 0; i < keys.length; i += 1) {
        searchFrom[keys[i]] = '';
      }
      // searchFrom({});
    };

    // from
    const formVisited = ref(true);

    onMounted(() => {
      props.facth();
    });

    return {
      pagination,
      tableData,
      column,
      searchFrom,
      enableSearch,
      fromItem,
      searchBtns,
      leftSpan,
      rightSpan,

      onReset,
      onSearch,
      onCurrentChange,
      onSizeChange,
      selectionChange,

      formVisited,
    };
  },
});
</script>

<style lang="scss" scoped>
.pagination {
  margin-top: 16px;
  text-align: right;
}
.main__header-buttons {
  text-align: right;
}
</style>
