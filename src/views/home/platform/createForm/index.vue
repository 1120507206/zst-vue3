<template>
  <main class="main">
    <ElRow
      class="main__header"
      justify="end"
    >
      <ElCol :span="18">
        <ElForm
          inline
          :model="searchFrom"
          label-width="5em"
        >
          <ElFormItem
            props="tableName"
            label="表名"
          >
            <ElInput
              v-model="searchFrom.tableName"
              placeholder="请输入表名"
              clearable
            />
          </ElFormItem>
          <!-- <ElFormItem
            props="name"
            label="名称"
          >
            <ElInput
              v-model="searchFrom.name"
              placeholder="请输入"
              clearable
            />
          </ElFormItem> -->
        </ElForm>
      </ElCol>
      <ElCol
        class="main__header-buttons"
        :span="6"
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
      </ElCol>
    </ElRow>
    <ElRow class="main__action">
      <ElCol>
        <ElButton
          type="primary"
          @click="onAdd"
        >
          新增
        </ElButton>
      </ElCol>
    </ElRow>
    <ElTable
      border
      :data="tableData"
      class="main__body"
      @selection-change="onSelectionChange"
    >
      <ElTableColumn
        type="selection"
        align="center"
        width="100"
      />
      <ElTableColumn
        label="id"
        align="center"
        prop="id"
        show-overflow-tooltip
        width="150"
      />
      <ElTableColumn
        label="表名"
        align="center"
        prop="tableName"
        show-overflow-tooltip
        width="250"
      />
      <ElTableColumn
        label="表描述"
        align="center"
        prop="tableDesc"
        show-overflow-tooltip
        width="250"
      />
      <ElTableColumn
        label="创建时间"
        align="center"
        prop="createTime"
        width="150"
      />

      <ElTableColumn
        label="操作"
        align="center"
      >
        <template #default="{ row }">
          <ElSpace>
            <ElButton
              type="text"
              @click="onEdit(row)"
            >
              编辑
            </ElButton>
            <ElButton
              type="text"
              @click="onDelete(row)"
            >
              删除
            </ElButton>
          </ElSpace>
        </template>
      </ElTableColumn>
    </ElTable>
    <div class="pagination">
      <ElPagination
        v-model:current-page="pagination.pageIndex"
        v-model:limit="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
        @current-change="onCurrentChange"
        @size-change="onSizeChange"
      />
    </div>

    <Action
      v-model:visible="isShowAction"
      :id="actionId"
      :type="actionType"
    />
  </main>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  onMounted,
} from 'vue';
import {
  ElRow,
  ElCol,
  ElButton,
  ElForm,
  ElFormItem,
  ElInput,
  ElTable,
  ElTableColumn,
  ElPagination,
  ElSpace,
  ElMessage,
  // ElDialog,
  // ElMessageBox,
} from 'element-plus';
import type { ResResult } from './data.d';
import { searchPage } from './service';

import Action from './components/action.vue';

export default defineComponent({
  components: {
    ElRow,
    ElCol,
    ElButton,
    ElForm,
    ElFormItem,
    ElInput,
    ElTable,
    ElTableColumn,
    ElPagination,
    ElSpace,
    // ElDialog,
    Action,
  },
  setup() {
    const searchFrom = reactive({
      tableName: '',
    });

    const onSearch = () => {
      //
    };
    const onReset = () => {
      //
    };

    //#region 弹窗
    const actionType = ref<'add' | 'edit'>('add');
    const actionId = ref('');
    const isShowAction = ref(true);
    const onAdd = () => {
      actionType.value = 'add';
      actionId.value = '';
      isShowAction.value = true;
    };
    //#endregion

    //#region 表格
    const tableData = ref<ResResult.SearchPageRow[]>();
    const pagination = reactive({
      total: 0,
      pageIndex: 1,
      pageSize: 10,
    });

    const fetchTableData = async () => {
      try {
        const { data: { success, message, obj } } = await searchPage({
          tableName: searchFrom.tableName,
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
        });
        if (success) {
          tableData.value = obj.data || [];
          pagination.total = obj.total || 0;
          pagination.pageIndex = obj.pageIndex || 1;
        } else {
          ElMessage.error(message);
        }
      } catch (e) {
        console.error('error', e);
      }
    };

    const onCurrentChange = (current: number) => {
      pagination.pageIndex = current;
      fetchTableData();
    };

    const onSizeChange = (size: number) => {
      pagination.pageSize = size;
      fetchTableData();
    };

    const onSelectionChange = () => {
      //
    };
    //#endregion

    //#region table events
    const onEdit = (tableRow: ResResult.SearchPageRow) => {
      actionType.value = 'edit';
      actionId.value = tableRow.id;
      isShowAction.value = true;
    };

    const onDelete = () => {
      //
    };
    //#endregion

    onMounted(() => {
      fetchTableData();
    });

    return {
      searchFrom,

      onSearch,
      onReset,

      //#region 弹窗
      actionType,
      isShowAction,
      actionId,
      onAdd,
      //#endregion

      //#region 表格
      tableData,
      pagination,
      onCurrentChange,
      onSizeChange,
      //#endregion

      //#region table events
      onSelectionChange,
      onEdit,
      onDelete,
      //#endregion

      actionTitleConfig: {
        add: '新增',
        edit: '编辑',
        detail: '详情',
        delete: '删除',
      },
    };
  },
});
</script>

<style lang="scss" scoped>
.main {
  .main__header {
    margin-bottom: 16px;

    .main__header-buttons {
      text-align: right;
    }
  }
  .main__action {
    margin-bottom: 16px;
  }

  //   .action__dialog{
  //       .el-dialog__header{
  //           border-bottom: 1px solid #000;
  //       }
  //   }
}
</style>
