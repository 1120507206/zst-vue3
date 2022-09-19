<template>
  <div class="audit">
    <ElRow
      class="table__header"
      :gutter="20"
      justify="end"
    >
      <ElCol
        class="table__header-buttons"
        :span="8"
      >
        <template v-if="type === 'todo'">
          <ElSpace>
            <ElButton
              v-if="buttonConfig.pushBtn"
              type="primary"
              @click="onSend"
            >
              {{ buttonConfig.pushBtnText }}
            </ElButton>
            <ElButton
              type="primary"
              @click="onShowProcess"
            >
              流程
            </ElButton>
            <ElButton
              v-if="buttonConfig.backBtn"
              type="primary"
              @click="onBack"
            >
              {{ buttonConfig.backBtnText }}
            </ElButton>
            <ElButton
              type="default"
              style="margin-right: -8px"
              @click="onCancel"
            >
              取消
            </ElButton>
          </ElSpace>
        </template>
        <template v-else>
          <ElSpace>
            <ElButton
              type="primary"
              @click="onShowProcess"
            >
              流程
            </ElButton>
            <ElButton
              type="default"
              @click="onCancel"
            >
              取消
            </ElButton>
          </ElSpace>
        </template>
      </ElCol>
    </ElRow>
    <template v-if="formComponent !== ''">
      <component
        :is="formComponent"
        type="readonly"
        :data-id="taskData.bizId"
      />
    </template>
    <div
      v-if="type === 'todo'"
      class="audit__form"
      :style="{ marginTop: formComponent !== '' ? '20px' : '0' }"
    >
      <ElForm
        ref="formRef"
        :model="formModel"
        :rules="formRules"
        label-width="120px"
      >
        <ElFormItem
          label="审批意见"
          prop="opinion"
        >
          <ElInput
            v-model="formModel.opinion"
            type="textarea"
            resize="none"
            :auto-size="{ minRows: 2, maxRows: 5 }"
            show-word-limit
            :maxlength="500"
            :readonly="type === 'done'"
          />
        </ElFormItem>
      </ElForm>
    </div>

    <AuditUser
      v-model:visible="isShowAudit"
      v-model:value="selectedUsers"
      @confirm="onAuditConfirm"
    />

    <Process
      v-model:visible="isShowProcess"
    />
  </div>
</template>

<script lang="ts">
import { cloneDeep } from 'lodash-es';
import localforage from 'localforage';
import {
  defineComponent,
  ref,
  computed,
  reactive,
  onMounted,
} from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import {
  ElRow,
  ElCol,
  ElForm,
  ElFormItem,
  ElInput,
  ElSpace,
  ElButton,
  ElMessage,
  ElMessageBox,
} from 'element-plus';
import type { StateType as GlobalStateType } from '@/store/global';
import type { StateType as UserLoginStateType } from '@/views/user/store';
import useDeleteTabNav from '@/composables/useDeleteTabNav';
// import CarApplicationForm from '@/views/home/car/apply/components/add-form.vue';
import AuditUser from './components/audit-user.vue';
import Process from './components/process.vue';
import {
  flowCommit,
  flowRecall,
} from './service';
import type {
  AuditUserItem,
  TaskData,
  FormConfig,
  ButtonConfig,
} from './data.d';

interface AuditFormData {
  opinion: string,
}

const initialFormData: AuditFormData = {
  opinion: '',
};

export default defineComponent({
  name: 'ProcessAudit',

  components: {
    ElRow,
    ElCol,
    ElForm,
    ElFormItem,
    ElInput,
    ElSpace,
    ElButton,
    AuditUser,
    Process,
  },

  setup() {
    const router = useRouter();
    const store = useStore<{
      global: GlobalStateType,
      user: UserLoginStateType,
    }>();
    const route = useRoute();
    const type = computed(() => (route.path.includes('todo') ? 'todo' : 'done')); // 判断是待办还是已办
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
    const formConfig = reactive<FormConfig>({
      roleId: '',
      orgId: '',
      upLevel: 1,
      afterNodeId: '',
      afterGroup: false,
      afterList: false,
      autoSelectNextOperator: false,
      isEdit: false,
    });
    const buttonConfig = reactive<ButtonConfig>({
      backBtn: true,
      backBtnText: '回退',
      pushBtn: true,
      pushBtnText: '推送',
      filedAwayBtn: true,
      filedAwayBtnText: '驳回',
      doJs: false,
      doJsFunction: '',
    });

    //#region form
    const formRef = ref();
    const formModel = reactive<AuditFormData>(cloneDeep(initialFormData));
    const formRules = {
      opinion: [
        {
          required: false,
          message: '请输入审批意见',
          trigger: 'blur',
        },
      ],
    };
    //#endregion

    //#region 选择下一步弹窗
    const isShowAudit = ref(false);
    const selectedUsers = ref<AuditUserItem[]>([]);
    //#endregion

    //#region events
    const onCancel = () => {
      useDeleteTabNav(store, router, { path: route.path });
    };

    const onAuditConfirm = async () => {
      try {
        await ElMessageBox.confirm('是否推送该审批？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        });
        const { data: { success, message } } = await flowCommit({
          bizId: taskData.bizId,
          processDefinitionId: taskData.processDefinitionId,
          assignee: selectedUsers.value.map((item) => item.id).join(','),
          comment: formModel.opinion,
        });
        if (success) {
          ElMessage.success('推送成功');
          onCancel();
        } else {
          ElMessage.error(message);
        }
      } catch (e) {
        if (e !== 'cancel') {
          console.log('error', e);
        }
      }
    };

    const onSend = () => {
      if (formConfig.afterNodeId !== 'endNode') {
        isShowAudit.value = true;
      } else {
        onAuditConfirm();
      }
    };

    const isShowProcess = ref(false);
    const onShowProcess = () => {
      isShowProcess.value = true;
    };

    const onBack = async () => {
      try {
        await ElMessageBox.confirm('是否回退该审批？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        });
        const { data: { success, message } } = await flowRecall({
          bizId: taskData.bizId,
          processDefinitionId: taskData.processDefinitionId,
          vars: {},
        });
        if (success) {
          ElMessage.success('回退成功');
          onCancel();
        } else {
          ElMessage.error(message);
        }
      } catch (e) {
        if (e !== 'cancel') {
          console.log('error', e);
        }
      }
    };
    //#endregion

    //#region 显示要求展示的表单
    const formMap = new Map([
      ['UserCarProcess', 'CarApplicationForm'],
    ]);
    const formComponent = computed(() => formMap.get(taskData.processDefinitionId) || '');
    //#endregion

    // // 代替原生的eval方法，提高安全性
    // const evaluateCode = (code: string): void => {
    //   const FN = Function; // 必要
    //   return new FN(`return ${code}`)();
    // };

    onMounted(async () => {
      // 读取缓存里面的审核数据、按钮设置等信息
      const data = await localforage.getItem('taskData');
      const parsedTaskData: TaskData = JSON.parse(data as string);
      const parsedFormConfig: FormConfig = parsedTaskData.formConfig
        ? JSON.parse(parsedTaskData.formConfig)
        : {};
      const parsedButtonConfig: ButtonConfig = parsedTaskData.buttonConfig
        ? JSON.parse(parsedTaskData.buttonConfig)
        : {};
      Object.assign(taskData, parsedTaskData);
      Object.assign(formConfig, parsedFormConfig);
      Object.assign(buttonConfig, parsedButtonConfig);
    });

    return {
      type,
      taskData,
      formConfig,
      buttonConfig,
      formComponent,

      //#region form
      formRef,
      formModel,
      formRules,
      //#endregion

      //#region 选择下一步弹窗
      isShowAudit,
      selectedUsers,
      onAuditConfirm,
      //#endregion

      //#region 查看流程
      isShowProcess,
      onShowProcess,
      //#endregion

      //#region events
      onSend,
      onBack,
      onCancel,
      //#endregion
    };
  },
});
</script>

<style lang="scss" scoped>
.table {
  &__header {
    margin-bottom: 20px;
    text-align: right;
  }
}
</style>
