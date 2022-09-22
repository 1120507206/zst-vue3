<template>
  <main class="main">
    <ElRow :gutter="20">
      <!-- <ElCol :span="4">
        <ElScrollbar class="tree" height="450px">
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
      </ElCol> -->
      <ElCol :span="24">
        <ElRow class="main__header" :gutter="20">
          <ElCol :span="2">
            <ElButton type="primary" @click="onAdd">
              新增用户
            </ElButton>

            <!-- <ElButton
              type="default"
              @click="onReset"
            >
              重置
            </ElButton> -->
          </ElCol>
          <ElCol :span="9">
            <ElForm ref="formRef" inline :model="formModel" label-width="80px">
              <ElFormItem prop="orgId">
                <ElInput v-model="formModel.orgName" placeholder="输入机构名称" />
              </ElFormItem>
              <ElFormItem prop="name">
                <ElInput v-model="formModel.account" placeholder="输入账号" />
              </ElFormItem>

            </ElForm>
          </ElCol>
          <ElCol :span="3">
            <ElButton type="primary" @click="onSearch">
              查询
            </ElButton>
          </ElCol>
        </ElRow>
        <ElTable border :data="tableData" class="main__body">
          <ElTableColumn label="账号" align="center" prop="account" />
          <ElTableColumn label="联系人" align="center" prop="userName" />
          <!-- <ElTableColumn
            label="性别"
            align="center"
            prop="gender"
          >
            <template #default="{ row }">
              {{ row.gender === 'M' ? '男' : '女' }}
            </template>
          </ElTableColumn> -->
          <ElTableColumn label="手机号" align="center" prop="contactNumber" />
          <ElTableColumn label="邮箱" align="center" prop="email" />
          <ElTableColumn label="机构名称" align="center" prop="orgName" />
          <ElTableColumn label="跟进人" align="center" prop="contactName" />
          <ElTableColumn label="更新时间" align="center" prop="updateTime" />
          <!-- <ElTableColumn
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
          </ElTableColumn> -->
          <ElTableColumn label="操作" align="center" width="250px">
            <template #default="{ row }">
              <ElSpace>
                <ElButton type="primary" @click="onEdit(row)">
                  编辑
                </ElButton>
                <ElButton type="primary" @click="goAuth(row)">
                  授权
                </ElButton>
                <!-- <ElButton type="text" @click="onDelete(row)">
                  删除
                </ElButton> -->
                <ElButton type="" @click="onShowSms(row)">
                  短信通知人
                </ElButton>
                <!-- <ElButton type="primary" @click="onShowIdentity(row)">
                  查看身份
                </ElButton> -->
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

    <Identity v-model:visible="isShowIdentity" :user-id="selectedID" />
    <Sms   v-model:visible="isShowSms" :userId="smsId"  />
  </main>
</template>

<script lang="ts">
  import {
    defineComponent,
    ref,
    reactive,
    onMounted,

  } from 'vue';
  import { useRouter } from "vue-router";
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
  import Sms from './components/sms.vue';
  import type { ResResult } from '@/views/home/system/org/data.d';
  import { getOrgTree } from '@/views/home/system/org/service';
  import {
    searchUserPage,
    searchUserOrgPage,
    deleteUser,
  } from './service';

  interface SearchForm {
    account: string,
    orgId?: string,
    orgName: string,
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
      Sms,
    },

    setup() {
      //#region 添加/编辑弹窗
      const isShowDialog = ref(false);
      const type = ref<'add' | 'edit'>('add');
      const router =useRouter()
      //#endregion

      //#region 页头操作
      const formRef = ref();
      const formModel = reactive<SearchForm>({
        account: '',
        orgName: '',
        // orgId: '',
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
      const tableData = ref();
      const pagination = reactive({
        total: 0,
        pageIndex: 1,
        pageSize: 10,
      });

      const fetchTableData = async () => {
        try {
          const { data: { success, message, obj } } = await searchUserOrgPage({
            orgId: selectedOrg.value ? selectedOrg.value.id : '',
            orgName:formModel.orgName,
            // searchKey: formModel.account,
            account: formModel.account,
            pageIndex: pagination.pageIndex,
            pageSize: pagination.pageSize,
          });
          if (success) {
            tableData.value = obj.data ? obj.data.map((item) => {
            return item
            }) : [];
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
const goAuth = (row: TableRow)=>{
router.push({
path: '/system/auth',
query:{
account: row.account,
id:row.id,
},
})
console.log('row :>> ', row);
}
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

      const isShowSms = ref(false);
  const smsId = ref('')
    const onShowSms = (row: TableRow) => {
    smsId.value = row.id;
    isShowSms.value = true;
    }
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
        goAuth,
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
  //#region 短信弹框
  smsId,
  onShowSms,
        isShowSms,
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
