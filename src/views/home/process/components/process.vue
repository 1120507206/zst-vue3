<template>
  <ElDialog
    v-model="isShowModal"
    title="审批"
    :close-on-click-modal="false"
    destroy-on-close
    @close="onCancel"
  >
    <template #default>
      <ElTable
        border
        :data="tableData"
        class="process__table"
      >
        <ElTableColumn
          label="审批人"
          align="center"
          prop="name"
        />
        <ElTableColumn
          label="节点名称"
          align="center"
          prop="node"
        />
        <ElTableColumn
          label="审批状态"
          align="center"
          prop="statusText"
        />
        <ElTableColumn
          label="审批时间"
          align="center"
          prop="date"
        />
        <ElTableColumn
          label="审批意见"
          align="center"
          prop="opinion"
          show-overflow-tooltip
        />
      </ElTable>
      <div class="process__title">
        审批流程图
      </div>
      <ElImage
        fit="contain"
        :src="imageSrc"
      />
    </template>
    <template #footer>
      <div class="process__footer">
        <ElSpace>
          <ElButton
            type="default"
            @click="onCancel"
          >
            取消
          </ElButton>
        </ElSpace>
      </div>
    </template>
  </ElDialog>
</template>

<script lang="ts">
import dayjs from 'dayjs';
import localforage from 'localforage';
import {
  defineComponent,
  ref,
  reactive,
  watch,
} from 'vue';
import {
  ElDialog,
  ElTable,
  ElTableColumn,
  ElImage,
  ElSpace,
  ElButton,
  ElMessage,
} from 'element-plus';
import { useVModel } from '@vueuse/core';
import apiBaseUrl from '@/config/apiBaseUrl';
import { findApprovalResults } from '../service';
import type { TaskData } from '../data.d';

type StatusNum = -1 | 0 | 1 | 2 | 3

interface TableRow {
  id: string,
  name: string,
  node: string,
  status: StatusNum,
  statusText: string,
  date: string,
  opinion: string,
}

const statusMap = new Map<StatusNum, string>([
  [-1, '已取消'],
  [0, '待审批'],
  [1, '已审批'],
  [2, '驳回'],
  [3, '已阅读'],
]);

export default defineComponent({
  name: 'Process',

  components: {
    ElDialog,
    ElTable,
    ElTableColumn,
    ElImage,
    ElSpace,
    ElButton,
  },

  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },

  setup(props) {
    const isShowModal = useVModel(props, 'visible');
    const taskData = reactive<TaskData>({
      appName: '',
      appNo: '',
      assignee: '',
      assigneeDeptName: '',
      assigneeName: '',
      bizId: '',
      businessKey: '',
      buttonConfig: '',
      curNodeKey: '',
      formConfig: '',
      formKey: '',
      launchDeptCode: '',
      launchDeptName: '',
      processDefinitionId: '',
      sendMan: '',
      sentDate: '',
      templateId: '',
      templateName: '',
    });
    const tableData = ref<TableRow[]>([]);
    const imageSrc = ref('');

    const fetchData = async () => {
      try {
        const { data: { success, obj, message } } = await findApprovalResults({
          bizId: taskData.bizId,
          processDefinitionId: taskData.processDefinitionId,
        });
        imageSrc.value = `${process.env.VUE_APP_APIHOST}${apiBaseUrl.get('sys')}/flow/getFlowGraphByBusinessKey?bizId=${taskData.bizId}&defKey=${taskData.processDefinitionId}`;
        if (success) {
          tableData.value = obj.map((item) => {
            const stateNumber = Number(item.state) as StatusNum;
            return {
              id: item.businessKey,
              name: item.assigneeName,
              node: item.taskName,
              status: stateNumber,
              statusText: statusMap.get(stateNumber) as string,
              date: item.startTime ? dayjs(item.startTime).format('YYYY-MM-DD hh:mm') : '',
              opinion: item.comments,
            };
          });
        } else {
          ElMessage.error(message);
        }
      } catch (e) {
        console.log('error', e);
      }
    };

    const onCancel = () => {
      isShowModal.value = false;
    };

    watch(isShowModal, async () => {
      if (isShowModal.value) {
        const data = await localforage.getItem('taskData');
        Object.assign(taskData, JSON.parse(data as string));
        await fetchData();
      }
    });

    return {
      isShowModal,
      tableData,
      imageSrc,
      onCancel,
    };
  },
});
</script>

<style lang="scss" scoped>
.process {
  &__buttons {
    margin-bottom: 20px;
    text-align: right;
  }

  &__table {
    margin-bottom: 20px;
  }

  &__title {
    margin-bottom: 20px;
    line-height: 1;
  }
}
</style>
