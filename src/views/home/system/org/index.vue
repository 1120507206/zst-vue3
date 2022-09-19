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
          justify="end"
        >
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
            label="组织名称"
            align="center"
            prop="name"
          />
          <ElTableColumn
            label="简称"
            align="center"
            prop="abbr"
          />
          <ElTableColumn
            label="上级组织名称"
            align="center"
            prop="org"
          />
          <ElTableColumn
            label="地址"
            align="center"
            prop="address"
            show-overflow-tooltip
          />
          <ElTableColumn
            label="是否有效"
            align="center"
            prop="isAvailable"
          >
            <template #default="{ row }">
              {{ row.isAvailable === 'Y' ? '有效' : '无效' }}
            </template>
          </ElTableColumn>
          <ElTableColumn
            label="排序号"
            align="center"
            prop="order"
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
      </ElCol>
    </ElRow>

    <AddOrg
      v-model:visible="isShowDialog"
      :data="selectedData"
      :type="type"
      @submitted="onOrgSubmitted"
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
  ElButton,
  ElTable,
  ElTableColumn,
  ElPagination,
  ElSpace,
  ElMessage,
  ElMessageBox,
} from 'element-plus';
import AddOrg from './components/add.vue';
import type { OrgFormData, ResResult } from './data.d';
import {
  getOrgTree,
  searchOrgPage,
  deleteOrg,
} from './service';

interface TableRow {
  id: string,
  name: string,
  abbr: string,
  org: string,
  address: string,
  isAvailable: 'Y' | 'N',
  order: number,
  parentID: string,
}

export default defineComponent({
  name: 'OrganizationManagement',

  components: {
    ElRow,
    ElCol,
    ElScrollbar,
    ElTree,
    ElButton,
    ElTable,
    ElTableColumn,
    ElPagination,
    ElSpace,
    AddOrg,
  },

  setup() {
    //#region 添加/编辑弹窗
    const isShowDialog = ref(false);
    const type = ref<'add' | 'edit'>('add');
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
        const { data: { success, message, obj } } = await searchOrgPage({
          addr: '',
          effective: '',
          orgName: '',
          parentId: selectedOrg.value ? selectedOrg.value.id : '',
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
        });
        if (success) {
          tableData.value = obj.data ? obj.data.map((item) => ({
            id: item.id,
            name: item.orgName,
            abbr: item.shortName,
            org: item.parentName,
            address: item.addr,
            isAvailable: item.effective,
            order: Number(item.showOrder),
            parentID: item.parentId,
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

    const fetchOrgData = async (isUpdate = false) => {
      try {
        const { data: { success, message, obj } } = await getOrgTree();
        if (success) {
          if (!isUpdate) {
            // init
            // currentNodeKey.value = '';
            currentNodeKey.value = obj[0].id;
            selectedOrg.value = obj[0];
          }
          orgData.value = obj;
          fetchTableData();
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
    const selectedData = ref<OrgFormData>();
    const onAdd = () => {
      selectedData.value = {
        id: '',
        name: '',
        abbr: '',
        address: '',
        order: 1,
        isAvailable: 'Y',
        parentID: currentNodeKey.value,
      };
      type.value = 'add';
      isShowDialog.value = true;
    };
    //#endregion

    const onEdit = (row: TableRow) => {
      selectedData.value = {
        id: row.id,
        name: row.name,
        abbr: row.abbr,
        address: row.address,
        order: row.order,
        isAvailable: row.isAvailable,
        parentID: row.parentID,
      };
      type.value = 'edit';
      isShowDialog.value = true;
    };

    const onDelete = async (row: TableRow) => {
      try {
        await ElMessageBox.confirm('是否删除该组织？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        });
        const { data: { success, message } } = await deleteOrg(row.id);
        if (success) {
          ElMessage.success('删除成功');
          await fetchOrgData(true);
        } else {
          ElMessage.error(message);
        }
      } catch (e) {
        if (e !== 'cancel') {
          console.log('error', e);
        }
      }
    };

    const onOrgSubmitted = () => {
      fetchOrgData(true);
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
      selectedData,
      onOrgSubmitted,
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
