<template>
  <main class="main">
    <ElRow :gutter="20">
      <ElCol :span="4">
        <ElScrollbar
          class="tree"
          height="450px"
        >
          <ElTree
            ref="menu"
            :data="menuData"
            node-key="id"
            highlight-current
            empty-text="加载中，请稍后"
            :current-node-key="currentNodeKey"
            :props="menuTreeProps"
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
            label="菜单名称"
            align="center"
            prop="name"
          />
          <ElTableColumn
            label="菜单类型"
            align="center"
            prop="typeText"
          />
          <ElTableColumn
            label="菜单描述"
            align="center"
            prop="desc"
          />
          <ElTableColumn
            label="菜单地址"
            align="center"
            prop="path"
          />
          <ElTableColumn
            label="图标路径"
            align="center"
            prop="icon"
          />
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

    <AddMenu
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
} from 'vue';
import { useStore } from 'vuex';
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
import type { StateType as GlobalStateType } from '@/store/global';
import type { StateType as UserLoginStateType } from '@/views/user/store';
import AddMenu from './components/add.vue';
import type { MenuFormData, ResResult } from './data.d';
import {
  getMenuTree,
  searchMenuPage,
  deleteMenu,
  getDrmSysResourceInfoTree
} from './service';

interface TableRow {
  id: string,
  name: string,
  type: 'control' | 'form' | 'menu',
  typeText: string,
  desc: string,
  path: string,
  icon: string,
  order: number,
  parentID: string,
  isAvailable: 'Y' | 'N',
}

export default defineComponent({
  name: 'MenuManagement',

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
    AddMenu,
  },

  setup() {
    const { dispatch } = useStore<{
      global: GlobalStateType,
      user: UserLoginStateType,
    }>();

    //#region 添加/编辑弹窗
    const isShowDialog = ref(false);
    const type = ref<'add' | 'edit'>('add');
    //#endregion

    //#region 树
    const selectedMenu = ref<ResResult.MenuTreeItem>();
    const menuData = ref<ResResult.MenuTreeItem[]>([]);
    const currentNodeKey = ref('');
    const menuTreeProps = reactive({
      children: 'children',
      label: 'name',
    });

    //#region 表格
    const menuTypeMap = new Map([
      ['control', '控件'],
      ['form', '表单'],
      ['menu', '菜单'],
    ]);
    const tableData = ref<TableRow[]>();
    const pagination = reactive({
      total: 0,
      pageIndex: 1,
      pageSize: 10,
    });

    const fetchTableData = async () => {
      try {
        const { data: { success, message, obj } } = await searchMenuPage({
          menuName: '',
          menuType: '',
          menuUrl: '',
          effective: '',
          parentId: selectedMenu.value ? selectedMenu.value.id : '',
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
        });
        if (success) {
          tableData.value = obj.data ? obj.data.map((item) => ({
            id: item.id,
            name: item.menuName,
            type: item.menuType,
            typeText: menuTypeMap.get(item.menuType) as string,
            desc: item.menuDescription,
            path: item.menuUrl,
            icon: item.iconPath,
            order: Number(item.menuOrder),
            parentID: item.parentId,
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

    const fetchMenuData = async (isUpdate = false) => {
      try {
        const { data: { success, message, obj } } = await getMenuTree();
        if (success) {
          if (!isUpdate) {
            // init
            currentNodeKey.value = '';
            // currentNodeKey.value = obj[0].id;
            // selectedMenu.value = obj[0];
          }
          menuData.value = obj;
          await fetchTableData();
        } else {
          ElMessage.error(message);
        }
      } catch (e) {
        console.error('error', e);
      }
    };

    const onNodeClick = (data: ResResult.MenuTreeItem) => {
      currentNodeKey.value = data.id;
      selectedMenu.value = data;
      fetchTableData();
    };

    //#region 页头操作
    const selectedData = ref<MenuFormData>();
    const onAdd = () => {
      selectedData.value = {
        id: '',
        name: '',
        order: 1,
        path: '',
        icon: '',
        type: 'menu',
        desc: '',
        parentID: currentNodeKey.value,
        isAvailable: 'Y',
        isSubmenu: false,
      };
      type.value = 'add';
      isShowDialog.value = true;
    };
    //#endregion

    const onEdit = (row: TableRow) => {
      selectedData.value = {
        ...row,
        isSubmenu: true,
      };
      type.value = 'edit';
      isShowDialog.value = true;
    };

    const onDelete = async (row: TableRow) => {
      try {
        await ElMessageBox.confirm('是否删除该菜单？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        });
        const { data: { success, message } } = await deleteMenu(row.id);
        if (success) {
          ElMessage.success('删除成功');
          await fetchMenuData(true);
        } else {
          ElMessage.error(message);
        }
      } catch (e) {
        if (e !== 'cancel') {
          console.log('error', e);
        }
      }
    };

    const onMenuSubmitted = () => {
      dispatch('user/fetchMenuData');
      fetchMenuData(true);
    };
    //#endregion

    //#region init
    const init = () => {
      fetchMenuData();
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
      menuData,
      currentNodeKey,
      menuTreeProps,
      fetchMenuData,
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
