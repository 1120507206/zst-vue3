<template>
  <main class="main">
    <ElRow
      class="main__header"
      justify="end"
    >
      <ElCol :span="18">
        <ElForm
          ref="formRef"
          inline
          :model="searchModel"
          label-width="5em"
        >
          <ElFormItem
            label="平台代码"
            prop="code"
          >
            <ElInput v-model="searchModel.code" />
          </ElFormItem>
          <ElFormItem
            label="平台名称"
            prop="platformName"
          >
            <ElInput v-model="searchModel.platformName" />
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
        label="平台代码"
        align="center"
        prop="code"
        show-overflow-tooltip
        width="160"
      />
      <ElTableColumn
        label="平台名称"
        align="center"
        prop="platformName"
        show-overflow-tooltip
        min-width="150"
      />
      <ElTableColumn
        label="联系人"
        align="center"
        prop="contacts"
        show-overflow-tooltip
        width="160"
      />
      <ElTableColumn
        label="邮箱地址"
        align="center"
        prop="email"
        show-overflow-tooltip
        width="160"
      />
      <ElTableColumn
        label="状态"
        align="center"
        prop="status"
        show-overflow-tooltip
        width="120"
      >
        <template #default="{ row }">
          <ElSwitch
            :value="row.status"
            active-value="Y"
            inactive-value="N"
          />
          {{ row.status === 'Y' ? '有效' : '无效' }}
        </template>
      </ElTableColumn>
      <ElTableColumn
        label="操作"
        align="center"
        width="200"
      >
        <template #default="{ row }">
          <ElSpace>
            <ElButton
              type="text"
              @click="onSetAuthByMenu(row)"
            >
              菜单关联
            </ElButton>
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

    <!-- 菜单权限 -->
    <LinkMenu
      v-model:visible="isShowDialogByAuth"
      :platform-id="curPlatformId"
    />
  </main>
</template>

<script lang="ts">
import {
  defineComponent, ref, reactive, onMounted, computed,
} from 'vue';
import {
  ElRow, ElCol, ElButton, ElTable, ElTableColumn, ElPagination, ElSpace, ElMessage, ElMessageBox, ElSwitch, ElInput, ElFormItem, ElForm,
} from 'element-plus';
import AddDoc from './components/add.vue';
import LinkMenu from './components/link-menu.vue';

import { ResResult } from './data.d';
import { initialFormData } from './initialData';
import { searchPage, deleteDoc } from './service';

export default defineComponent({
  name: 'Tenant',
  components: {
    ElRow,
    ElCol,
    ElButton,
    ElTable,
    ElTableColumn,
    ElPagination,
    ElSpace,
    AddDoc,
    ElSwitch,
    LinkMenu,
    ElInput,
    ElFormItem,
    ElForm,
  },

  setup() {
    //#region 添加/编辑弹窗
    const isShowDialog = ref(false);
    const isShowDialogByAuth = ref(false);
    const curPlatformId = ref('');
    const type = ref<'add' | 'edit'>('add');
    const searchModel = reactive({
      code: '',
      platformName: '',
    });
    //#endregion

    //#region 树
    //#region 表格
    const selectedTableRow = ref<ResResult.DictFormData[]>([]);
    const tableData = ref<ResResult.DictFormData[]>();

    const canDelALL = computed(() => Boolean(selectedTableRow.value && selectedTableRow.value.length));

    const pagination = reactive({
      total: 0,
      pageIndex: 1,
      pageSize: 10,
    });

    const fetchTableData = async () => {
      try {
        const {
          data: { success, message, obj },
        } = await searchPage({
          ...searchModel,
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
        });
        if (success) {
          tableData.value = obj.data
            ? obj.data.map((item: ResResult.DictFormData) => ({
              ...item,
            }))
            : [];
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
    const removeRemoteById = (id: string, isMulti?: string) => {
      deleteDoc(id).then((res) => {
        const {
          data: { message, status },
        } = res;
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
    const selectedData = ref<ResResult.DictFormData>();
    const onAdd = () => {
      selectedData.value = initialFormData;
      type.value = 'add';
      isShowDialog.value = true;
    };
    const onSearch = () => {
      fetchTableData();
    };

    const onReset = () => {
      searchModel.code = '';
      searchModel.platformName = '';
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
        }).then(() => {
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
      }).then(() => {
        if (row.id) {
          removeRemoteById(row.id);
        }
      });
    };

    const onSetAuthByMenu = (row: ResResult.DictFormData) => {
      curPlatformId.value = row.id;
      isShowDialogByAuth.value = true;
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
      searchModel,
      onReset,
      onSearch,

      //#region 表格
      canDelALL,
      tableData,
      pagination,
      onDelByCheckBox,
      onEdit,
      onDelete,
      onCurrentChange,
      onSizeChange,
      //#endregion

      //#region 添加/编辑弹窗
      isShowDialog,
      isShowDialogByAuth,
      type,
      selectedData,
      onMenuSubmitted,
      onSetAuthByMenu,
      curPlatformId,
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
