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
            props="ckey"
            label="KEY"
          >
            <ElInput
              v-model="searchFrom.ckey"
              placeholder="请输入"
              clearable
            />
          </ElFormItem>
          <ElFormItem
            props="type"
            label="类型"
          >
            <ElInput
              v-model="searchFrom.type"
              placeholder="请输入"
              clearable
            />
          </ElFormItem>
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
        <ElButton
          :disabled="!canDelALL"
          @click="onDelByCheckBox"
        >
          删除选中
        </ElButton>
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
      @selection-change="selectionChange"
    >
      <ElTableColumn
        type="selection"
        width="55"
      />
      <ElTableColumn
        label="KEY"
        align="center"
        prop="ckey"
        show-overflow-tooltip
        min-width="25%"
      />
      <ElTableColumn
        label="值"
        align="center"
        prop="cvalue"
        show-overflow-tooltip
        min-width="25%"
      />

      <ElTableColumn
        label="类型"
        align="center"
        prop="type"
        show-overflow-tooltip
        min-width="25%"
      />
      <ElTableColumn
        label="备注"
        align="center"
        prop="remark"
        min-width="25%"
      />

      <ElTableColumn
        label="操作"
        align="center"
        width="200"
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
        v-model:page="pagination.pageIndex"
        v-model:limit="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
        @current-change="onCurrentChange"
        @size-change="onSizeChange"
      />
    </div>

    <AddDoc
      v-model:visible="isShowDialog"
      :data="selectedData"
      :type="type"
      @submitted="onMenuSubmitted"
    />
  </main>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  onMounted,
  computed,
} from 'vue';
import {
  ElRow,
  ElCol,
  ElButton,
  ElTable,
  ElTableColumn,
  ElPagination,
  ElSpace,
  ElMessage,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessageBox,
} from 'element-plus';
import AddDoc from './components/add.vue';
import type { ResResult } from './data.d';
import {
  searchPage, deleteDoc,
} from './service';

export default defineComponent({
  name: 'Dictionary',

  components: {
    ElRow,
    ElCol,
    ElButton,
    ElTable,
    ElTableColumn,
    ElPagination,
    ElSpace,
    AddDoc,
    ElForm,
    ElFormItem,
    ElInput,

  },

  setup() {
    //#region 添加/编辑弹窗
    const isShowDialog = ref(false);
    const type = ref<'add' | 'edit'>('add');
    //#endregion

    //#region 树
    //#region 表格
    const selectedTableRow = ref< ResResult.DictFormData[]>([]);
    const tableData = ref< ResResult.DictFormData[]>();
    const canDelALL = computed(() => Boolean(selectedTableRow.value
     && selectedTableRow.value.length));
    const pagination = reactive({
      total: 0,
      pageIndex: 1,
      pageSize: 10,
    });

    const searchFrom = reactive({
      ckey: '',
      type: '',
    });

    const fetchTableData = async () => {
      try {
        const { data: { success, message, obj } } = await searchPage({
          ...searchFrom,
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,

        });
        if (success) {
          tableData.value = obj.data ? obj.data.map((item: ResResult.DictFormData) => ({
            ckey: item.ckey,
            id: item.id,
            time: item.updateTime,
            remark: item.remark,
            cvalue: item.cvalue,
            type: item.type,

          })) : [];
          pagination.total = obj.total || 0;
          pagination.pageIndex = obj.pageIndex || 1;
        } else {
          ElMessage.error(message);
        }
      } catch (e) {
        console.error('error', e);
      }
    };
      // 从服务器 删除一项
    const removeRemoteById = (id:string, isMulti?:string) => {
      deleteDoc(id).then((res) => {
        const { data: { message, status } } = res;
        if (status === 200) {
          if (isMulti) {
            if (id === isMulti) {
              ElMessage.success(message);
              fetchTableData();
            }
          } else {
            ElMessage.success(message);
            fetchTableData();
          }
        } else {
          ElMessage.error(message);
        }
      });
    };

    const onCurrentChange = (current: number) => {
      pagination.pageIndex = current;
      fetchTableData();
    };

    const onSizeChange = (size: number) => {
      pagination.pageSize = size;
      fetchTableData();
    };
    //#endregion

    //#region 页头操作
    const selectedData = ref< ResResult.DictFormData>();
    const onAdd = () => {
      selectedData.value = {
        id: '',
        ckey: '',
        remark: '',
        type: '',
        cvalue: '',
      };
      type.value = 'add';
      isShowDialog.value = true;
    };

    const onSearch = () => {
      fetchTableData();
    };

    const onReset = () => {
      searchFrom.ckey = '';
      searchFrom.type = '';
      fetchTableData();
    };
    //#endregion

    const onEdit = (row: ResResult.DictFormData) => {
      selectedData.value = {
        ...row,
      };
      type.value = 'edit';
      isShowDialog.value = true;
    };
    const onDelByCheckBox = () => {
      const rows = selectedTableRow.value;
      if (rows && rows.length) {
        selectedTableRow.value = rows;
        ElMessageBox.confirm('是否删除已选中项目？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            const lastItemById = rows[rows.length - 1].id;
            rows.forEach((it) => {
              removeRemoteById(it.id, lastItemById);
            });
          });
      }
    };
    const onMenuSubmitted = () => {
      fetchTableData();
    };
    //#endregion

    //#region 选择复选框
    function selectionChange(rows: ResResult.DictFormData[]) {
      selectedTableRow.value = rows;
    }
    //#endregion

    // 删除一项提醒
    const onDelete = (row: ResResult.DictFormData) => {
      ElMessageBox.confirm('是否删除该项目？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          if (row.id) {
            removeRemoteById(row.id);
          }
        });
    };

    //#region init
    const init = () => {
      fetchTableData();
    };

    onMounted(() => {
      init();
    });
    //#endregion

    return {
      //#region 页头
      onAdd,
      //#endregion
      selectionChange,

      //#region 表格
      onReset,
      onSearch,
      canDelALL,
      tableData,
      pagination,
      searchFrom,

      onDelByCheckBox,
      onEdit,
      onDelete,
      onCurrentChange,
      onSizeChange,
      //#endregion

      //#region 添加/编辑弹窗
      isShowDialog,
      type,
      selectedData,
      onMenuSubmitted,
      //#endregion
    };
  },
});
</script>

<style lang="scss" scoped>
.main {
  &__header {
    margin-bottom: 16px;

    &-buttons {
      text-align: right;
    }
  }
}

.tree {
  border: 1px solid #eee;
  width: 100%;
}

.pagination {
  margin-top: 16px;
  text-align: right;
}
</style>
