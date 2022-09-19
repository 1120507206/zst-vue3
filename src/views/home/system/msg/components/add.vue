<template>
  <ElDialog
    v-model="isShowModal"
    :title="title"
    :close-on-click-modal="false"
    destroy-on-close
    @close="onCancel"
  >
    <template #default>
      <ElForm
        ref="formRef"
        :model="formModel"
        :rules="formRules"
        label-width="120px"
      >
        <ElFormItem
          label="业务名称"
          prop="business"
        >
          <ElInput
            v-model="formModel.business"
          />
        </ElFormItem>
        <ElFormItem
          label="表单配置"
          prop="key"
        >
          <ElInput
            v-model="formModel.key"
          />
        </ElFormItem>
        <ElFormItem
          label="跳转地址"
          prop="href"
        >
          <ElInput
            v-model="formModel.href"
          />
        </ElFormItem>
        <ElFormItem
          label="主题"
          prop="theme"
        >
          <CKEditor
            v-model="formModel.theme"
            style="width: 600px"
          />
        </ElFormItem>
      </ElForm>
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
import { cloneDeep } from 'lodash-es';
import {
  defineComponent,
  toRefs,
  ref,
  computed,
  watch,
  reactive,
  PropType,
} from 'vue';
import {
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElSpace,
  ElButton,
  ElMessage,
} from 'element-plus';
import { useVModel } from '@vueuse/core';
import CKEditor from '@/components/CKEditor/index.vue';
import type { MsgFormData } from '../data.d';
import { save } from '../service';

interface ComponentProps {
  visible: boolean,
  type: 'add' | 'edit',
  data: MsgFormData,
}

const initialFormData: MsgFormData = {
  id: '',
  theme: '',
  business: '',
  key: '',
  href: '',
};

export default defineComponent({
  name: 'AddMenu',

  components: {
    ElDialog,
    ElForm,
    ElFormItem,
    ElInput,
    ElSpace,
    ElButton,
    CKEditor,
  },

  props: {
    visible: {
      type: Boolean,
      default: false,
    },

    type: {
      type: String as PropType<ComponentProps['type']>,
      default: 'add',
    },

    data: {
      type: Object as PropType<ComponentProps['data']>,
      default() {
        return cloneDeep(initialFormData);
      },
    },
  },

  emits: [
    'update:visible',
    'submitted',
  ],

  setup(props: ComponentProps, { emit }) {
    const { type, data } = toRefs(props);
    const title = computed(() => (type.value === 'add' ? '新增公告' : '修改公告'));
    const isShowModal = useVModel(props, 'visible');

    //#region form
    const formRef = ref();
    const formModel = reactive<MsgFormData>(cloneDeep(initialFormData));
    const formRules = {
      theme: [
        { required: true, message: '请输入主题', trigger: 'blur' },
      ],
      business: [
        { required: true, message: '请输入业务名称', trigger: 'blur' },
      ],
      key: [
        { required: true, message: '请输入表单配置', trigger: 'blur' },
      ],
      href: [
        { required: true, message: '请输入跳转地址', trigger: 'blur' },
      ],
    };
    //#endregion

    watch([isShowModal, type], () => {
      Object.assign(formModel, data.value);
    });

    const onCancel = () => {
      formRef.value.resetFields();
      isShowModal.value = false;
    };

    const onConfirm = () => {
      formRef.value.validate(async (isValid: boolean) => {
        if (isValid) {
          console.log(formModel, data);
          try {
            const { data: { success, message } } = await save({
              id: formModel.id,
              appName: formModel.theme,
              // assignee: string,
              bizName: formModel.business,
              formKey: formModel.key,
              formLocaltion: formModel.href,
              // launchDeptCode: string,
              // state: '0' | '1', // 处理状态：0待处理，1已处理
            });
            if (success) {
              ElMessage.success('修改成功');
              onCancel();
              emit('submitted');
            } else {
              ElMessage.error(message);
            }
          } catch (e) {
            console.log('error', e);
          }
        }
      });
    };

    return {
      isShowModal,
      title,
      onConfirm,
      onCancel,

      //#region form
      formRef,
      formModel,
      formRules,
      //#endregion
    };
  },
});
</script>

<style lang="scss" scoped>

</style>
