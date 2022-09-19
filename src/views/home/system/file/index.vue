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
            label="附件名称"
            prop="name"
          >
            <ElInput
              v-model="formModel.name"
            />
          </ElFormItem>
          <ElFormItem
            label="附件类型"
            prop="type"
          >
            <ElInput
              v-model="formModel.type"
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
      </ElCol>
    </ElRow>
    <ElTable
      border
      :data="tableData"
      class="main__body"
    >
      <ElTableColumn
        label="附件名称"
        align="center"
        prop="name"
      />
      <ElTableColumn
        label="附件类型"
        align="center"
        prop="type"
      />
      <ElTableColumn
        label="附件大小"
        align="center"
        prop="size"
      />
      <ElTableColumn
        label="上传人"
        align="center"
        prop="uploader"
      />
      <ElTableColumn
        label="上传时间"
        align="center"
        prop="uploadDate"
      />
      <ElTableColumn
        label="操作"
        align="center"
      >
        <template #default="{ row }">
          <ElSpace>
            <ElButton
              type="text"
              @click="onDelete(row)"
            >
              删除
            </ElButton>
            <ElButton
              type="text"
              @click="onDownload(row)"
            >
              下载
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
  </main>
</template>

<script lang="ts">
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
  ElForm,
  ElFormItem,
  ElInput,
  ElTable,
  ElTableColumn,
  ElPagination,
  ElSpace,
  ElButton,
  ElMessage,
  ElMessageBox,
} from 'element-plus';
import fileSizeToString from '@/utils/fileSizeToString';
import {
  searchPage,
  deleteFile,
  download,
} from './service';

interface SearchForm {
  name: string,
  type: string,
}

interface TableRow {
  id: string,
  name: string,
  type: string,
  size: string,
  uploader: string,
  uploadDate: string,
}

export default defineComponent({
  name: 'FileManagement',

  components: {
    ElRow,
    ElCol,
    ElForm,
    ElFormItem,
    ElInput,
    ElTable,
    ElTableColumn,
    ElSpace,
    ElButton,
    ElPagination,
  },

  setup() {
    //#region 页头操作
    const formRef = ref();
    const formModel = reactive<SearchForm>({
      name: '',
      type: '',
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
          name: formModel.name,
          type: formModel.type,
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
        });
        if (success) {
          tableData.value = obj.data ? obj.data.map((item) => ({
            id: item.id,
            name: item.name,
            type: item.type,
            size: fileSizeToString(item.size),
            uploader: item.createBy,
            uploadDate: dayjs(item.createTime).format('YYYY-MM-DD hh:mm'),
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

    const onSearch = () => {
      fetchTableData();
    };

    const onReset = () => {
      formRef.value.resetFields();
      fetchTableData();
    };

    const onDelete = async (row: TableRow) => {
      try {
        await ElMessageBox.confirm('是否删除该文件？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        });
        const { data: { success, message } } = await deleteFile(row.id);
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

    const onDownload = (row: TableRow) => {
      download({
        id: row.id,
        name: row.name,
      });
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
      //#endregion

      //#region 表格
      tableData,
      pagination,
      onDelete,
      onDownload,
      onCurrentChange,
      onSizeChange,
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
