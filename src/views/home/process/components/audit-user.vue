<template>
  <ElDialog
    v-model="isShowModal"
    title="审批"
    :close-on-click-modal="false"
    destroy-on-close
    @close="onCancel"
  >
    <template #default>
      <div class="audit">
        <div class="audit__left">
          <div class="audit__title">
            下一步操作提示
          </div>
          <ul class="audit__list">
            <li
              v-for="(item, index) in processList"
              :key="index"
              :class="['audit__list-item', selectedProcess === item ? 'active' : '']"
            >
              {{ item }}
            </li>
          </ul>
        </div>
        <div class="audit__button">
          <DArrowRight />
        </div>
        <div class="audit__right">
          <div class="audit__right-header">
            <div class="audit__title">
              人员列表
            </div>
            <ElInput
              v-model="userSearchKey"
              suffix-icon="el-icon-search"
              style="width: 160px"
            />
          </div>
          <ul class="audit__list">
            <li
              v-for="item in auditUserList"
              :key="item.id"
              :class="['audit__list-item', selectedUser.id === item.id ? 'active' : '']"
              @click="selectedUser = item"
            >
              {{ item.name }}
            </li>
          </ul>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="dialog__footer">
        <ElSpace>
          <ElButton
            type="default"
            @click="onCancel"
          >
            取消
          </ElButton>
          <ElButton
            type="primary"
            @click="onConfirm"
          >
            确定
          </ElButton>
        </ElSpace>
      </div>
    </template>
  </ElDialog>
</template>

<script lang="ts">
import localforage from 'localforage';
import {
  defineComponent,
  ref,
  reactive,
  watch,
  toRefs,
  PropType,
} from 'vue';
import { useStore } from 'vuex';
import {
  ElDialog,
  ElSpace,
  ElInput,
  ElButton,
  ElMessage,
} from 'element-plus';
import { DArrowRight } from '@element-plus/icons';
import { useVModel } from '@vueuse/core';
import { StateType as GlobalStateType } from '@/store/global';
import { StateType as UserLoginStateType } from '@/views/user/store';
import { findNextAssigneeUser } from '../service';
import { AuditUserItem, TaskData } from '../data.d';

interface ComponentProps {
  visible: boolean,
  isStart: boolean,
  value: AuditUserItem[],
}

export default defineComponent({
  name: 'AuditUser',

  components: {
    ElDialog,
    ElSpace,
    ElInput,
    ElButton,
    DArrowRight,
  },

  props: {
    visible: {
      type: Boolean,
      default: false,
    },

    // 是否发起流程
    isStart: {
      type: Boolean,
      default: false,
    },

    value: {
      type: Array as PropType<ComponentProps['value']>,
      default() {
        return [];
      },
    },
  },

  emits: [
    'update:visible',
    'update:value',
    'confirm',
  ],

  setup(props: ComponentProps, { emit }) {
    const { state } = useStore<{
      global: GlobalStateType,
      user: UserLoginStateType,
    }>();
    const { isStart } = toRefs(props);
    const isShowModal = useVModel(props, 'visible');
    const selectedValue = useVModel(props, 'value');
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
    const processList = ref<string[]>([]);
    const selectedProcess = ref<string>('');
    const userSearchKey = ref('');
    const auditUserList = ref<AuditUserItem[]>([]);
    const selectedUser = ref<AuditUserItem>({
      id: '',
      name: '',
    });

    const fetchData = async () => {
      try {
        const { data: { success, obj, message } } = await findNextAssigneeUser({
          bizId: taskData.bizId,
          orgId: isStart.value ? state.user.userInfo.org.id : '',
          processDefinitionId: taskData.processDefinitionId,
        });
        if (success) {
          processList.value = [obj.nextPostInfo];
          selectedProcess.value = processList.value[0];
          auditUserList.value = obj.candidateInfoList.map((item) => ({
            id: item.userIdentityId,
            name: item.userName,
          }));
        } else {
          ElMessage.error(message);
        }
      } catch (e) {
        console.log('error', e);
      }
    };

    const onConfirm = () => {
      selectedValue.value = [selectedUser.value];

      if (!selectedUser.value.id) {
        ElMessage.error('请选择下一步用户');
        return;
      }

      emit('confirm');
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
      processList,
      selectedProcess,
      userSearchKey,
      auditUserList,
      selectedUser,
      onConfirm,
      onCancel,
    };
  },
});
</script>

<style lang="scss" scoped>
@use "~@/assets/css/utils.scss";

.audit {
  display: flex;
  align-items: center;
  justify-content: space-between;

  &__left {
    width: 280px;
  }

  &__right {
    width: 280px;

    &-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  &__button {
    width: 32px;
    font-size: 32px;
  }

  &__title {
    height: 32px;
    font-weight: 700;
    line-height: 32px;
  }

  &__list {
    @include utils.resetUL();
    margin-top: 20px;
    border: 1px solid #eee;

    &-item {
      padding: 8px;
      color: #eee;
      background: #fff;

      &.active {
        color: #333;
        background: #eee;
      }
    }
  }
}
</style>
