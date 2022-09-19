<template>
  <main class="main">
    <ElRow :gutter="20">
      <ElCol :span="4">
        <ElScrollbar
          class="tree"
          height="450px"
        >
          <ElTree
            ref="org"
            :data="orgData"
            node-key="id"
            highlight-current
            empty-text="加载中，请稍后"
            :current-node-key="currentNodeKey"
            :props="orgTreeProps"
            @node-click="onNodeClick"
          />
        </ElScrollbar>
      </ElCol>
      <ElCol :span="20">
        <ElRow
          class="main__header"
          :gutter="20"
        >
          <ElCol :span="18">
            <ElForm
              ref="formRef"
              inline
              :model="formModel"
              label-width="80px"
            >
              <ElFormItem
                label="姓名"
                prop="name"
              >
                <ElInput
                  v-model="formModel.name"
                />
              </ElFormItem>
              <!--              <ElFormItem-->
              <!--                label="性别"-->
              <!--                prop="gender"-->
              <!--              >-->
              <!--                <ElSelect-->
              <!--                  v-model="formModel.gender"-->
              <!--                  placeholder="请选择"-->
              <!--                  clearable-->
              <!--                >-->
              <!--                  <ElOption-->
              <!--                    label="男"-->
              <!--                    value="M"-->
              <!--                  />-->
              <!--                  <ElOption-->
              <!--                    label="女"-->
              <!--                    value="F"-->
              <!--                  />-->
              <!--                </ElSelect>-->
              <!--              </ElFormItem>-->
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
            label="账号"
            align="center"
            prop="account"
          />
          <ElTableColumn
            label="姓名"
            align="center"
            prop="name"
          />
          <ElTableColumn
            label="性别"
            align="center"
            prop="gender"
          >
            <template #default="{ row }">
              {{ row.gender === 'M' ? '男' : '女' }}
            </template>
          </ElTableColumn>
          <ElTableColumn
            label="电话"
            align="center"
            prop="mobile"
          />
          <ElTableColumn
            label="电子信箱"
            align="center"
            prop="email"
          />
          <ElTableColumn
            label="图标路径"
            align="center"
            prop="icon"
          />
          <ElTableColumn
            label="是否删除"
            align="center"
            prop="isDelete"
          >
            <template #default="{ row }">
              {{ row.isDelete === 'Y' ? '是' : '否' }}
            </template>
          </ElTableColumn>
          <ElTableColumn
            label="操作"
            align="center"
            width="150px"
          >
            <template #default="{ row }">
              <ElSpace>
                <ElButton
                  type="text"
                  @click="onEdit(row)"
                >
                  修改
                </ElButton>
                <ElButton
                  type="text"
                  @click="onDelete(row)"
                >
                  删除
                </ElButton>
                <ElButton
                  type="text"
                  @click="onShowIdentity(row)"
                >
                  查看身份
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
      </ElCol>
    </ElRow>

    <AddUser
      v-model:visible="isShowDialog"
      :type="type"
      :org-id="selectedOrg ? selectedOrg.id : ''"
      :user-id="selectedID"
      @submitted="onUserSubmitted"
    />

    <Identity
      v-model:visible="isShowIdentity"
      :user-id="selectedID"
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
  ElScrollbar,
  ElTree,
  ElForm,
  ElFormItem,
  ElInput,
  // ElSelect,
  // ElOption,
  ElButton,
  ElTable,
  ElTableColumn,
  ElPagination,
  ElSpace,
  ElMessage,
  ElMessageBox,
} from 'element-plus';
import AddUser from './components/add.vue';
import Identity from './components/identity.vue';
import type { ResResult } from '@/views/home/system/org/data.d';
import { getOrgTree } from '@/views/home/system/org/service';
import {
  searchUserPage,
  deleteUser,
} from './service';

interface SearchForm {
  name: string,
  // gender: 'M' | 'F' | '',
}

interface TableRow {
  id: string,
  account: string,
  name: string,
  gender: string,
  mobile: string,
  email: string,
  icon: string,
  isDelete: 'Y' | 'N',
}

export default defineComponent({
  name: 'UserManagement',

  components: {
    ElRow,
    ElCol,
    ElScrollbar,
    ElTree,
    ElForm,
    ElFormItem,
    ElInput,
    // ElSelect,
    // ElOption,
    ElButton,
    ElTable,
    ElTableColumn,
    ElPagination,
    ElSpace,
    AddUser,
    Identity,
  },

  setup() {
    //#region 添加/编辑弹窗
    const isShowDialog = ref(false);
    const type = ref<'add' | 'edit'>('add');
    //#endregion

    //#region 页头操作
    const formRef = ref();
    const formModel = reactive<SearchForm>({
      name: '',
      // gender: '',
    });
    //#endregion

    //#region 树
    const selectedOrg = ref<ResResult.OrgTreeItem>();
    const orgData = ref<ResResult.OrgTreeItem[]>([]);
    const currentNodeKey = ref('');
    const orgTreeProps = reactive({
      children: 'children',
      label: 'name',
    });

    //#region 表格
    const tableData = ref<TableRow[]>();
    const pagination = reactive({
      total: 0,
      pageIndex: 1,
      pageSize: 10,
    });

    const fetchTableData = async () => {
      try {
        const { data: { success, message, obj } } = await searchUserPage({
          orgId: selectedOrg.value ? selectedOrg.value.id : '',
          searchKey: formModel.name,
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
        });
        if (success) {
          tableData.value = obj.data ? obj.data.map((item) => ({
            id: item.id,
            account: item.account,
            name: item.userName,
            gender: item.gender,
            mobile: item.contactNumber,
            email: item.emailbox,
            icon: item.iconPath,
            isDelete: item.isDelete,
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

    const fetchOrgData = async () => {
      try {
        const { data: { success, message, obj } } = await getOrgTree();
        if (success) {
          currentNodeKey.value = obj[0].id;
          selectedOrg.value = obj[0];
          orgData.value = obj;
          await fetchTableData();
        } else {
          ElMessage.error(message);
        }
      } catch (e) {
        console.error('error', e);
      }
    };

    const onNodeClick = (data: ResResult.OrgTreeItem) => {
      currentNodeKey.value = data.id;
      selectedOrg.value = data;
      fetchTableData();
    };

    //#region 页头操作
    const selectedID = ref('');

    const onSearch = () => {
      fetchTableData();
    };

    const onReset = () => {
      formRef.value.resetFields();
      fetchTableData();
    };

    const onAdd = () => {
      selectedID.value = '';
      type.value = 'add';
      isShowDialog.value = true;
    };
    //#endregion

    const onEdit = (row: TableRow) => {
      selectedID.value = row.id;
      type.value = 'edit';
      isShowDialog.value = true;
    };

    const onDelete = async (row: TableRow) => {
      try {
        await ElMessageBox.confirm('是否删除该用户？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        });
        const { data: { success, message } } = await deleteUser(row.id);
        if (success) {
          ElMessage.success('删除成功');
          await fetchOrgData();
        } else {
          ElMessage.error(message);
        }
      } catch (e) {
        if (e !== 'cancel') {
          console.log('error', e);
        }
      }
    };

    const isShowIdentity = ref(false);
    const onShowIdentity = (row: TableRow) => {
      selectedID.value = row.id;
      isShowIdentity.value = true;
    };

    const onUserSubmitted = () => {
      fetchTableData();
    };
    //#endregion

    //#region init
    const init = () => {
      fetchOrgData();
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

      //#region 树
      orgData,
      currentNodeKey,
      orgTreeProps,
      fetchOrgData,
      onNodeClick,
      //#endregion

      //#region 表格
      tableData,
      pagination,
      onEdit,
      onDelete,
      onCurrentChange,
      onSizeChange,
      //#endregion

      //#region 添加/编辑弹窗
      isShowDialog,
      type,
      selectedOrg,
      selectedID,
      onUserSubmitted,
      //#endregion

      //#region 查看身份
      isShowIdentity,
      onShowIdentity,
      //#endregion
    };
  },
});
</script>

<style lang="scss" scoped>
.main {
  &__header {
    //margin-bottom: 16px;

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
