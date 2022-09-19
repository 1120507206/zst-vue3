<template>
  <div class="table">
    <template v-if="!simple">
      <ElRow
        class="table__header"
        :gutter="20"
      >
        <ElCol
          class="table__header-inner"
          :span="21"
        >
          <ElForm
            ref="formRef"
            inline
            :model="formModel"
            label-width="80px"
          >
            <ElFormItem
              label="流程ID"
              prop="processId"
            >
              <ElInput
                v-model="formModel.processId"
                class="table__header-input"
              />
            </ElFormItem>
            <ElFormItem
              label="申请编号"
              prop="sn"
            >
              <ElInput
                v-model="formModel.sn"
                class="table__header-input"
              />
            </ElFormItem>
            <ElFormItem
              label="申请主题"
              prop="theme"
            >
              <ElInput
                v-model="formModel.theme"
                class="table__header-input"
              />
            </ElFormItem>
            <ElFormItem
              label="申请时间"
              prop="date"
            >
              <ElDatePicker
                v-model="formModel.date"
                type="daterange"
                class="table__header-date"
                style="width: 280px"
              />
            </ElFormItem>
          </ElForm>
        </ElCol>
        <ElCol
          class="table__header-buttons"
          :span="3"
        >
          <ElSpace>
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
          </ElSpace>
        </ElCol>
      </ElRow>
    </template>
    <ElTable
      border
      :data="tableData"
      class="table__body"
    >
      <ElTableColumn
        label="流程类型"
        align="center"
        prop="type"
      />
      <ElTableColumn
        label="申请编号"
        align="center"
        prop="sn"
      />
      <ElTableColumn
        label="申请主题"
        align="center"
        prop="theme"
      />
      <template v-if="type === 'todo'">
        <ElTableColumn
          label="申请单位"
          align="center"
          prop="dept"
        />
        <ElTableColumn
          label="申请人"
          align="center"
          prop="assigneeName"
        />
        <ElTableColumn
          label="申请时间"
          align="center"
          prop="approveDate"
        />
      </template>
      <template v-else>
        <ElTableColumn
          label="任务名称"
          align="center"
          prop="task"
        />
        <ElTableColumn
          label="审批人"
          align="center"
          prop="approver"
        />
        <ElTableColumn
          label="审批时间"
          align="center"
          prop="submitDate"
        />
      </template>
      <ElTableColumn
        label="操作"
        align="center"
      >
        <template #default="{ row }">
          <ElSpace>
            <ElButton
              type="text"
              @click="onAudit(row)"
            >
              {{ type === 'todo' ? '审批' : '查看' }}
            </ElButton>
          </ElSpace>
        </template>
      </ElTableColumn>
    </ElTable>
    <div
      v-if="!simple"
      class="pagination"
    >
      <ElPagination
        v-model:page="pagination.pageIndex"
        v-model:limit="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
        @current-change="onCurrentChange"
        @size-change="onSizeChange"
      />
    </div>
  </div>
</template>

<script lang="ts">
import dayjs from 'dayjs';
import localforage from 'localforage';
import {
  defineComponent,
  ref,
  toRefs,
  reactive,
  watch,
  onMounted,
  PropType,
} from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import {
  ElRow,
  ElCol,
  ElForm,
  ElFormItem,
  ElInput,
  ElDatePicker,
  ElTable,
  ElTableColumn,
  ElPagination,
  ElSpace,
  ElButton,
  ElMessage,
} from 'element-plus';
import type { StateType as GlobalStateType } from '@/store/global';
import type { StateType as UserLoginStateType } from '@/views/user/store';
import useAddTabNav from '@/composables/useAddTabNav';
import {
  getNeedDealtPageTask,
  getHandledPageTaskDist,
} from '../service';
import { ResResult } from '../data.d';

interface ComponentProps {
  simple: boolean,
  type: 'todo' | 'done',
}

interface SearchForm {
  processId: string,
  sn: string,
  theme: string,
  date: [Date, Date] | '',
}

interface TableRow {
  id: string,
  type: string,
  sn: string,
  theme: string,
  dept: string,
  assigneeName: string,
  task: string,
  approver: string,
  approveDate: string,
  submitDate: string,
}

export default defineComponent({
  name: 'ProcessTodoTable',

  components: {
    ElRow,
    ElCol,
    ElForm,
    ElFormItem,
    ElInput,
    ElDatePicker,
    ElTable,
    ElTableColumn,
    ElPagination,
    ElSpace,
    ElButton,
  },

  props: {
    simple: {
      type: Boolean,
      default: false,
    },

    type: {
      type: String as PropType<ComponentProps['type']>,
      default: 'todo',
    },
  },

  setup(props: ComponentProps) {
    const router = useRouter();
    const store = useStore<{
      global: GlobalStateType,
      user: UserLoginStateType,
    }>();
    const { type } = toRefs(props);

    //#region 页头操作
    const formRef = ref();
    const formModel = reactive<SearchForm>({
      processId: '',
      sn: '',
      theme: '',
      date: '',
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
        let startDate = '';
        let endDate = '';
        if (Array.isArray(formModel.date)) {
          startDate = dayjs(formModel.date[0] as Date).format('YYYY-MM-DD');
          endDate = dayjs(formModel.date[1] as Date).format('YYYY-MM-DD');
        }
        const req = type.value === 'todo' ? getNeedDealtPageTask : getHandledPageTaskDist;
        const { data: { success, message, obj } } = await req({
          processDefinitionKey: formModel.processId,
          assignee: formModel.sn,
          appName: formModel.theme,
          createTimeStart: startDate,
          createTimeEnd: endDate,
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
        });
        if (success) {
          tableData.value = obj.data ? obj.data.map((item: ResResult.ListItem) => ({
            ...item,
            id: item.processDefinitionId,
            type: item.templateName,
            sn: item.appNo,
            theme: item.appName,
            dept: item.launchDeptName,
            assigneeName: item.sendMan,
            task: item.curNodeKey,
            approver: item.assigneeName,
            approveDate: dayjs(item.sentDate).format('YYYY-MM-DD'),
            submitDate: dayjs(item.sentDate).format('YYYY-MM-DD'), // fixme 目前没有合适的字段，纯占位
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

    const onAudit = async (item: ResResult.ListItem) => {
      const arr = item.businessKey.split('|');
      await localforage.setItem('taskData', JSON.stringify({
        ...item,
        bizId: arr[1],
      }));
      useAddTabNav(store, router, type.value === 'todo' ? {
        title: '待办审批',
        path: '/process/todo-audit',
      } : {
        title: '已办审批',
        path: '/process/done-audit',
      });
    };
    //#endregion

    const onSearch = () => {
      fetchTableData();
    };

    const onReset = () => {
      formRef.value.resetFields();
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

    watch(type, () => {
      fetchTableData();
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
      onAudit,
      onCurrentChange,
      onSizeChange,
      //#endregion
    };
  },
});
</script>

<style lang="scss" scoped>
.table {
  &__header {
    margin-bottom: 16px;

    &-input {
      width: 140px;
    }

    &-buttons {
      text-align: right;
    }
  }
}

.pagination {
  margin-top: 16px;
  text-align: right;
}
</style>
