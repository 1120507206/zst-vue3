<template>
  <main class="main">
    <ElRow
      class="main__header"
      :gutter="20"
    >
      <ElCol :span="18">
        <ElForm
          ref="formRef"
          inline
          :model="formModel"
          label-width="120px"
        >
          <ElFormItem
            label="公告标题"
            prop="theme"
          >
            <ElInput
              v-model="formModel.theme"
            />
          </ElFormItem>
          <ElFormItem
            label="处理人"
            prop="assignee"
          >
            <ElInput
              v-model="formModel.assignee"
            />
          </ElFormItem>
          <ElFormItem
            label="公告内容"
            prop="business"
          >
            <ElInput
              v-model="formModel.business"
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
        label="公告标题"
        align="center"
        prop="theme"
      />
      <!--      <ElTableColumn-->
      <!--        label="处理人"-->
      <!--        align="center"-->
      <!--        prop="assignee"-->
      <!--      />-->
      <ElTableColumn
        label="公告内容"
        align="center"
        prop="business"
      />
      <!--<ElTableColumn
       label="表单配置"
       align="center"
       prop="key"
     />
     <ElTableColumn
       label="跳转地址"
       align="center"
       prop="href"
     />
          <ElTableColumn-->
      <!--        label="发起单位"-->
      <!--        align="center"-->
      <!--        prop="dept"-->
      <!--        show-overflow-tooltip-->
      <!--      />-->
      <ElTableColumn
        label="是否有效"
        align="center"
        prop="status"
      >
        <template #default="{ row }">
          {{ row.status === '0' ? '是' : '否' }}
        </template>
      </ElTableColumn>
      <ElTableColumn
        label="创建人"
        align="center"
        prop="creator"
      />
      <ElTableColumn
        label="创建日期"
        align="center"
        prop="createDate"
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
              修改
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

    <AddMsg
      v-model:visible="isShowDialog"
      :data="selectedData"
      :type="type"
      @submitted="onMsgSubmitted"
    />
  </main>
</template>

<script lang="ts">
// 公告管理，或者叫通知管理什么的
import dayjs from 'dayjs';
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
  ElTable,
  ElTableColumn,
  ElPagination,
  ElSpace,
  ElMessage,
  ElMessageBox,
} from 'element-plus';
import AddMsg from './components/add.vue';
import type { MsgFormData } from './data.d';
import {
  searchPage,
  deleteMsg,
} from './service';

interface SearchForm {
  theme: string,
  assignee: string,
  business: string,
}

interface TableRow {
  id: string,
  theme: string,
  assignee: string,
  business: string,
  key: string,
  href: string,
  dept: string,
  status: '0' | '1', // 处理状态：0待处理，1已处理
  creator: string,
  createDate: string,
}

export default defineComponent({
  name: 'MessageManagement',

  components: {
    ElRow,
    ElCol,
    ElButton,
    ElTable,
    ElTableColumn,
    ElPagination,
    ElSpace,
    AddMsg,
  },

  setup() {
    //#region 添加/编辑弹窗
    const isShowDialog = ref(false);
    const type = ref<'add' | 'edit'>('add');
    //#endregion

    //#region 页头操作
    const formRef = ref();
    const formModel = ref<SearchForm>({
      theme: '',
      assignee: '',
      business: '',
    });
    //#endregion

    //#region 表格
    const tableData = ref<TableRow[]>();
    const pagination = reactive({
      total: 0,
      pageIndex: 1,
      pageSize: 10,
    });

    const fetchTableData = async () => {
      try {
        const { data: { success, message, obj } } = await searchPage({
          appName: formModel.value.theme,
          assignee: formModel.value.assignee,
          bizName: formModel.value.business,
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
        });
        if (success) {
          tableData.value = obj.data ? obj.data.map((item) => ({
            id: item.id,
            theme: item.appName,
            assignee: item.assignee,
            business: item.bizName,
            key: item.formKey,
            href: item.formLocaltion,
            dept: item.launchDeptCode,
            status: item.state, // 处理状态：0待处理，1已处理
            creator: item.createBy,
            createDate: dayjs(item.createTime).format('YYYY-MM-DD hh:mm'),
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
    const selectedData = ref<MsgFormData>();

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
        theme: '',
        business: '',
        key: '',
        href: '',
      };
      type.value = 'add';
      isShowDialog.value = true;
    };
    //#endregion

    const onEdit = (row: TableRow) => {
      selectedData.value = {
        id: row.id,
        theme: row.theme,
        business: row.business,
        key: row.key,
        href: row.href,
      };
      type.value = 'edit';
      isShowDialog.value = true;
    };

    const onDelete = async (row: TableRow) => {
      try {
        await ElMessageBox.confirm('是否删除该公告？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        });
        const { data: { success, message } } = await deleteMsg(row.id);
        if (success) {
          ElMessage.success('删除成功');
          await fetchTableData();
        } else {
          ElMessage.error(message);
        }
      } catch (e) {
        if (e !== 'cancel') {
          console.log('error', e);
        }
      }
    };

    const onMsgSubmitted = () => {
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
      onDelete,
      onCurrentChange,
      onSizeChange,
      //#endregion

      //#region 添加/编辑弹窗
      isShowDialog,
      type,
      selectedData,
      onMsgSubmitted,
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
