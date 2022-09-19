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
            props="key"
            label="KEY"
          >
            <ElInput
              v-model="searchFrom.key"
              placeholder="请输入"
              clearable
            />
          </ElFormItem>
          <ElFormItem
            props="name"
            label="名称"
          >
            <ElInput
              v-model="searchFrom.name"
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
        label="ID"
        align="center"
        prop="id"
        show-overflow-tooltip
        width="200"
      />

      <ElTableColumn
        label="KEY"
        align="center"
        prop="key"
        show-overflow-tooltip
        width="100"
      />
      <ElTableColumn
        label="名称"
        align="center"
        prop="name"
        show-overflow-tooltip
        width="100"
      />
      <ElTableColumn
        label="版本"
        align="center"
        prop="version"
        show-overflow-tooltip
        width="120"
      />
      <ElTableColumn
        label="创建时间"
        align="center"
        prop="createTime"
      />
      <ElTableColumn
        label="更新时间"
        align="center"
        prop="lastUpdateTime"
      />

      <ElTableColumn
        label="操作"
        align="center"
        width="250"
      >
        <template #default="{ row }">
          <ElSpace>
            <ElButton
              type="text"
              @click="onDeploy(row)"
            >
              部署
            </ElButton>
            <ElButton
              type="text"
              @click="onExport(row)"
            >
              导出XML
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
        v-model:current-page="pagination.pageIndex"
        v-model:limit="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
        @current-change="onCurrentChange"
        @size-change="onSizeChange"
      />
    </div>

    <AddDoc
      v-model:visible="isShowDialog"
      :type="type"
      @submitted="onMenuSubmitted"
    />
  </main>
</template>

<script lang="ts">
import {
  defineComponent, ref, reactive, onMounted, nextTick,
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
  ElMessageBox,
  ElMessage,
} from 'element-plus';
import { searchPage, Delete as deleteModel, Deploy as deployModel } from './service';
import { ResResult } from './data.d';
import AddDoc from './components/add.vue';

export default defineComponent({
  name: 'Dispostion',
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
    AddDoc,
  },
  setup() {
    const searchFrom = reactive({
      key: '',
      name: '',
    });

    const pagination = reactive({
      total: 0,
      pageIndex: 1,
      pageSize: 10,
    });

    const selectionChange = () => {
      //
    };

    const tableData = ref<ResResult.Rows>();

    const getList = async () => {
      // const d = {
      //   key: '',
      //   name: '',
      //   pageSize: 10,
      //   pageIndex: 1,
      // };
      const {
        data: { success, message, obj },
      } = await searchPage({
        ...searchFrom,
        pageSize: pagination.pageSize,
        pageIndex: pagination.pageIndex,
      });
      console.log(success, obj, message);
      if (success) {
        tableData.value = obj.data ? obj.data.map((item: ResResult.Row) => ({
          key: item.key,
          id: item.id,
          name: item.name,
          description: item.description,
          createTime: item.createTime,
          lastUpdateTime: item.lastUpdateTime,
          version: item.version,
        })) : [];

        pagination.total = obj.total || 0;
        pagination.pageIndex = obj.pageIndex || 1;
        console.log(tableData.value);
        // setTimeout(() => {
        //   console.log(23232323);
        //   tableData.value = [{
        //     description: 'string',
        //     key: 'string',
        //     name: 'string',
        //   }];
        // }, 5000);
      }
    };

    const onSearch = () => {
      getList();
    };

    const onReset = () => {
      searchFrom.key = '';
      searchFrom.name = '';
      pagination.pageIndex = 1;
      onSearch();
    };

    const onCurrentChange = (current: number) => {
      pagination.pageIndex = current;
      onSearch();
    };

    const onSizeChange = (size: number) => {
      pagination.pageIndex = 1;
      pagination.pageSize = size;
      onSearch();
    };

    //#region 添加/编辑弹窗
    const isShowDialog = ref(false);
    const type = ref<'add' | 'edit'>('add');
    // const type = ref('add');
    console.log(isShowDialog);
    console.log(type);
    // const selectedData = ref< ResResult.DictFormData>();
    const onMenuSubmitted = (id) => {
      onSearch();
      nextTick(() => {
        window.open(`http://192.168.1.52:10025/act/modeler/modeler.html?modelId=${id}`);
      });
    };
    //#endregion

    const onAdd = () => {
      console.log(type.value);
      type.value = 'add';
      isShowDialog.value = true;
    };

    const onDeploy = (row: ResResult.Row) => {
      ElMessageBox.confirm('是否部署该模型？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        if (row.id) {
          const { data: { status, message } } = await deployModel(row.id);
          if (status === 200) {
            ElMessage.success('部署成功');
            onSearch();
          } else {
            ElMessage.error(message);
          }
        }
      });
    };

    const onExport = (row: ResResult.Row) => {
      window.open(`/api/act/wf/modeler/export/${row.id}`);
    };

    const onEdit = (row: ResResult.Row) => {
      window.open(`http://192.168.1.52:10025/act/modeler/modeler.html?modelId=${row.id}`);
    };

    const onDelete = (row: ResResult.Row) => {
      console.log(row);
      ElMessageBox.confirm('是否删除该模型？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        if (row.id) {
          const { data: { status, message } } = await deleteModel(row.id);
          if (status === 200) {
            ElMessage.success('删除成功');
            onSearch();
          } else {
            ElMessage.error(message);
          }
        }
      });
    };

    onMounted(() => {
      onSearch();
    });

    return {
      isShowDialog,
      type,
      onMenuSubmitted,

      searchFrom,
      pagination,
      onCurrentChange,
      onSizeChange,

      onSearch,
      onReset,
      onAdd,
      onDeploy,
      onExport,
      onEdit,
      onDelete,

      tableData,
      selectionChange,
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
}
</style>
