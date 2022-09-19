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
          label="人员身份"
          prop="name"
        >
          <ElInput
            v-model="formModel.identity"
          />
        </ElFormItem>
        <ElFormItem
          label="是否主身份"
          prop="isMain"
        >
          <ElSelect
            v-model="formModel.isMain"
            placeholder="请选择"
          >
            <ElOption
              label="是"
              value="Y"
            />
            <ElOption
              label="否"
              value="N"
            />
          </ElSelect>
        </ElFormItem>
        <ElFormItem
          label="是否有效"
          prop="isAvailable"
        >
          <ElSelect
            v-model="formModel.isAvailable"
            placeholder="请选择"
          >
            <ElOption
              label="是"
              value="Y"
            />
            <ElOption
              label="否"
              value="N"
            />
          </ElSelect>
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
  ElSelect,
  ElOption,
  ElInput,
  ElSpace,
  ElButton,
  ElMessage,
} from 'element-plus';
import { useVModel } from '@vueuse/core';
import type { UserIdentityFormData, UserIdentityData } from '../data.d';
import { saveUserIdentity } from '../service';

interface ComponentProps {
  visible: boolean,
  type: 'add' | 'edit',
  data: UserIdentityData,
}

const initialFormData: UserIdentityFormData = {
  identity: '',
  isMain: 'Y',
  isAvailable: 'Y',
};

export default defineComponent({
  name: 'AddUserIdentity',

  components: {
    ElDialog,
    ElForm,
    ElFormItem,
    ElSelect,
    ElOption,
    ElInput,
    ElSpace,
    ElButton,
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
        return {
          id: '',
          userId: '',
          orgId: '',
          orgName: '',
          order: 1,
          identity: '',
          isMain: 'Y',
          isAvailable: 'Y',
        };
      },
    },
  },

  emits: [
    'update:visible',
    'submitted',
  ],

  setup(props: ComponentProps, { emit }) {
    const { type, data } = toRefs(props);
    const title = computed(() => (type.value === 'add' ? '新增用户身份' : '修改用户身份'));
    const isShowModal = useVModel(props, 'visible');

    //#region form
    const formRef = ref();
    const formModel = reactive<UserIdentityFormData>(cloneDeep(initialFormData));
    const formRules = {
      identity: [
        {
          required: true,
          message: '请输入',
          trigger: 'blur',
        },
      ],
    };
    //#endregion

    //#region 获取数据
    watch([isShowModal, type], () => {
      if (type.value === 'edit' && isShowModal.value) {
        Object.assign(formModel, {
          identity: data.value.identity,
          isMain: data.value.isMain,
          isAvailable: data.value.isAvailable,
        } as UserIdentityFormData);
      }
    });
    //#endregion

    const onCancel = () => {
      formRef.value.resetFields();
      isShowModal.value = false;
    };

    const onConfirm = () => {
      formRef.value.validate(async (isValid: boolean) => {
        if (isValid) {
          try {
            const {
              data: {
                success,
                message,
              },
            } = await saveUserIdentity({
              id: data.value.id,
              orgId: data.value.orgId,
              showOrder: String(data.value.order),
              userId: data.value.userId,
              userIdentityName: formModel.identity,
              effective: formModel.isAvailable,
              primaryIdentity: formModel.isMain,
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
