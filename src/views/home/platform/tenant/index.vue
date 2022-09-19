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
          <ElFormItem label="公司名称">
            <ElInput
              v-model="searchFrom.companyName"
              placeholder="请输入"
              clearable
            />
          </ElFormItem>
          <ElFormItem label="联系人">
            <ElInput
              v-model="searchFrom.contacts"
              placeholder="请输入"
              clearable
            />
          </ElFormItem>
          <ElFormItem
            label="联系人电话"
            label-width="6em"
          >
            <ElInput
              v-model="searchFrom.telephone"
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
        width="40"
      />
      <ElTableColumn
        label="公司名称"
        align="center"
        prop="companyName"
        show-overflow-tooltip
        width="200"
      />

      <ElTableColumn
        label="联系人"
        align="center"
        prop="contacts"
        show-overflow-tooltip
        width="100"
      />
      <ElTableColumn
        label="联系人电话"
        align="center"
        prop="telephone"
        show-overflow-tooltip
        width="100"
      />
      <ElTableColumn
        label="邮箱"
        align="center"
        prop="email"
        show-overflow-tooltip
        width="120"
      >
        <template #default="{ row }">
          {{ row.email || '-' }}
        </template>
      </ElTableColumn>
      <ElTableColumn
        label="地址"
        align="center"
        prop="addr"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          {{ row.addr || '-' }}
        </template>
      </ElTableColumn>
      <ElTableColumn
        label="备注"
        align="center"
        prop="remark"
      >
        <template #default="{ row }">
          {{ row.remark || '-' }}
        </template>
      </ElTableColumn>
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
        width="250"
      >
        <template #default="{ row }">
          <ElSpace>
            <ElButton
              type="text"
              @click="onLink(row)"
            >
              关联租户
            </ElButton>
            <ElButton
              type="text"
              @click="onSetAuthByMenu(row)"
            >
              菜单权限
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

    <!-- 编辑/新增 -->
    <AddDoc
      v-model:visible="isShowDialog"
      :data="selectedData"
      :type="type"
      @submitted="onEditConfirm"
    />

    <!-- 菜单权限 -->
    <MenuAuth
      v-model:visible="isShowDialogByAuth"
      :teant-id="curTeantId"
    />

    <!-- 关联用户 -->
    <LinkUser
      v-model:visible="isShowDialogByLink"
      :teant-id="curTeantId"
    />
  </main>
</template>

<script lang="ts">
import {
  defineComponent, ref, reactive, onMounted, computed,
} from 'vue';
import {
  ElRow, ElCol, ElButton, ElTable, ElTableColumn, ElPagination, ElSpace, ElMessage, ElMessageBox, ElSwitch, ElForm, ElFormItem, ElInput,
} from 'element-plus';
import AddDoc from './components/add.vue';
import MenuAuth from './components/menu-auth.vue';
import LinkUser from './components/link-user.vue';
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
    MenuAuth,
    LinkUser,
    ElForm,
    ElFormItem,
    ElInput,
  },

  setup() {
    //#region 添加/编辑弹窗
    const isShowDialog = ref(false);
    const curTeantId = ref('');
    const isShowDialogByAuth = ref(false);
    const isShowDialogByLink = ref(false);
    const type = ref<'add' | 'edit'>('add');
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
    const searchFrom = reactive({
      contacts: '',
      telephone: '',
      companyName: '',
    });

    const fetchTableData = async () => {
      try {
        const {
          data: { success, message, obj },
        } = await searchPage({
          ...searchFrom,
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
      searchFrom.contacts = '';
      searchFrom.telephone = '';
      searchFrom.companyName = '';
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

    const onSetAuthByMenu = (row: ResResult.DictFormData) => {
      curTeantId.value = row.id;
      isShowDialogByAuth.value = true;
    };

    const onLink = (row: ResResult.DictFormData) => {
      curTeantId.value = row.id;
      isShowDialogByLink.value = true;
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
    const onEditConfirm = () => {
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

    //#region init
    const init = async () => {
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
      canDelALL,
      searchFrom,
      tableData,
      pagination,
      onDelByCheckBox,
      onEdit,
      onDelete,
      onCurrentChange,
      onSizeChange,
      onSetAuthByMenu,
      onLink,
      onReset,
      onSearch,
      //#endregion

      //#region 添加/编辑弹窗
      curTeantId,
      isShowDialog,
      isShowDialogByAuth,
      isShowDialogByLink,
      type,
      selectedData,
      onEditConfirm,
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
