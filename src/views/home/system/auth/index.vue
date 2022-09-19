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
          :model="formModel"
          label-width="120px"
        >
          <ElFormItem
            label="角色名称"
            prop="name"
          >
            <ElInput
              v-model="formModel.name"
            />
          </ElFormItem>
          <ElFormItem
            label="是否有效"
            prop="isAvailable"
          >
            <ElSelect
              v-model="formModel.isAvailable"
              placeholder="请选择"
              clearable
            >
              <ElOption
                label="有效"
                value="Y"
              />
              <ElOption
                label="无效"
                value="N"
              />
            </ElSelect>
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
    >
      <ElTableColumn
        label="角色名称"
        align="center"
        prop="name"
        show-overflow-tooltip
        min-width="25%"
      />
      <ElTableColumn
        label="角色描述"
        align="center"
        prop="desc"
        show-overflow-tooltip
        min-width="25%"
      />
      <ElTableColumn
        label="排序号"
        align="center"
        prop="order"
        min-width="10%"
      />
      <ElTableColumn
        label="是否有效"
        align="center"
        prop="isAvailable"
        min-width="10%"
      >
        <template #default="{ row }">
          {{ row.isAvailable === 'Y' ? '有效' : '无效' }}
        </template>
      </ElTableColumn>
      <ElTableColumn
        label="操作"
        align="center"
        min-width="30%"
      >
        <template #default="{ row }">
          <ElSpace>
            <ElButton
              type="text"
              @click="onUserAssociate(row)"
            >
              关联用户
            </ElButton>
            <ElButton
              type="text"
              @click="onSetAuth(row)"
            >
              权限设置
            </ElButton>
            <ElButton
              type="text"
              @click="onEdit(row)"
            >
              修改
            </ElButton>
            <!--            <ElButton-->
            <!--              type="text"-->
            <!--              @click="onDelete(row)"-->
            <!--            >-->
            <!--              删除-->
            <!--            </ElButton>-->
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

    <AddAuth
      v-model:visible="isShowDialog"
      :data="selectedData"
      :type="type"
      @submitted="onMenuSubmitted"
    />

    <UserAssociate
      v-model:visible="isShowUserAssociate"
      :auth-id="selectedTableRow ? selectedTableRow.id : ''"
    />

    <SetAuth
      v-model:visible="isShowSetAuth"
      :auth-id="selectedTableRow ? selectedTableRow.id : ''"
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
  ElForm,
  ElFormItem,
  ElInput,
  ElSelect,
  ElOption,
  ElButton,
  ElTable,
  ElTableColumn,
  ElPagination,
  ElSpace,
  ElMessage,
  // ElMessageBox,
} from 'element-plus';
import AddAuth from './components/add.vue';
import UserAssociate from './components/user-associate.vue';
import SetAuth from './components/set-auth.vue';
import type { AuthFormData } from './data.d';
import {
  searchRolePage,
} from './service';

interface SearchForm {
  name: string,
  isAvailable: 'Y' | 'N' | '',
}

interface TableRow {
  id: string,
  name: string,
  desc: string,
  order: number,
  isAvailable: 'Y' | 'N',
}

export default defineComponent({
  name: 'AuthManagement',

  components: {
    ElRow,
    ElCol,
    ElForm,
    ElFormItem,
    ElInput,
    ElSelect,
    ElOption,
    ElButton,
    ElTable,
    ElTableColumn,
    ElPagination,
    ElSpace,
    AddAuth,
    UserAssociate,
    SetAuth,
  },

  setup() {
    //#region 页头操作
    const formRef = ref();
    const formModel = reactive<SearchForm>({
      name: '',
      isAvailable: '',
    });
    //#endregion

    //#region 添加/编辑弹窗
    const isShowDialog = ref(false);
    const type = ref<'add' | 'edit'>('add');
    //#endregion

    //#region 树
    //#region 表格
    const selectedTableRow = ref<TableRow>();
    const tableData = ref<TableRow[]>();
    const pagination = reactive({
      total: 0,
      pageIndex: 1,
      pageSize: 10,
    });

    const fetchTableData = async () => {
      try {
        const { data: { success, message, obj } } = await searchRolePage({
          roleName: formModel.name,
          effective: formModel.isAvailable,
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
        });
        if (success) {
          tableData.value = obj.data ? obj.data.map((item) => ({
            id: item.id,
            name: item.roleName,
            desc: item.describes,
            order: Number(item.showOrder),
            isAvailable: item.effective,
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
    const selectedData = ref<AuthFormData>();

    const onSearch = () => {
      fetchTableData();
    };

    const onReset = () => {
      formRef.value.resetFields();
      fetchTableData();
    };

    const onAdd = () => {
      selectedData.value = {
        id: '',
        name: '',
        desc: '',
        order: 1,
        isAvailable: 'Y',
      };
      type.value = 'add';
      isShowDialog.value = true;
    };
    //#endregion

    //#region 关联用户
    const isShowUserAssociate = ref(false);
    const onUserAssociate = (row: TableRow) => {
      selectedTableRow.value = row;
      isShowUserAssociate.value = true;
    };
    //#endregion

    //#region 权限设置
    const isShowSetAuth = ref(false);
    const onSetAuth = (row: TableRow) => {
      selectedTableRow.value = row;
      isShowSetAuth.value = true;
    };
    //#endregion

    const onEdit = (row: TableRow) => {
      selectedData.value = {
        ...row,
      };
      type.value = 'edit';
      isShowDialog.value = true;
    };

    // const onDelete = async (row: TableRow) => {
    //   try {
    //     await ElMessageBox.confirm('是否删除该菜单？', '提示', {
    //       confirmButtonText: '确定',
    //       cancelButtonText: '取消',
    //       type: 'warning',
    //     });
    //     const { data: { success, message } } = await deleteMenu(row.id);
    //     if (success) {
    //       ElMessage.success('删除成功');
    //       await fetchTableData();
    //     } else {
    //       ElMessage.error(message);
    //     }
    //   } catch (e) {
    //     if (e !== 'cancel') {
    //       console.log('error', e);
    //     }
    //   }
    // };

    const onMenuSubmitted = () => {
      fetchTableData();
    };
    //#endregion

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
      formRef,
      formModel,
      onSearch,
      onReset,
      onAdd,
      //#endregion

      //#region 表格
      tableData,
      pagination,
      onEdit,
      // onDelete,
      onCurrentChange,
      onSizeChange,
      //#endregion

      //#region 关联用户
      selectedTableRow,
      isShowUserAssociate,
      onUserAssociate,
      //#endregion

      //#region 权限设置
      isShowSetAuth,
      onSetAuth,
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
