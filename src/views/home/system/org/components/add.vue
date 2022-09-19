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
          label="组织名称"
          prop="name"
        >
          <ElInput
            v-model="formModel.name"
            maxlength="25"
          />
        </ElFormItem>
        <ElFormItem
          label="简称"
          prop="abbr"
        >
          <ElInput
            v-model="formModel.abbr"
            maxlength="25"
          />
        </ElFormItem>
        <ElFormItem
          label="地址"
          prop="address"
        >
          <ElInput
            v-model="formModel.address"
            maxlength="50"
          />
        </ElFormItem>
        <ElFormItem
          label="排序号"
          prop="order"
        >
          <ElInputNumber
            v-model="formModel.order"
            :min="1"
            :max="9999"
            step-strictly
          />
        </ElFormItem>
        <ElFormItem
          label="有效标记"
          prop="isAvailable"
        >
          <ElSelect
            v-model="formModel.isAvailable"
            placeholder="请选择"
          >
            <ElOption
              label="有效"
              value="Y"
            />
            <ElOption
              label="无效"
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
  ElInputNumber,
  ElSpace,
  ElButton,
  ElMessage,
} from 'element-plus';
import { useVModel } from '@vueuse/core';
import type { OrgFormData } from '../data.d';
import { save } from '../service';

interface ComponentProps {
  visible: boolean,
  type: 'add' | 'edit',
  data: OrgFormData,
}

const initialFormData: OrgFormData = {
  id: '',
  name: '',
  abbr: '',
  address: '',
  order: 1,
  isAvailable: 'Y',
  parentID: '',
};

export default defineComponent({
  name: 'AddMenu',

  components: {
    ElDialog,
    ElForm,
    ElFormItem,
    ElSelect,
    ElOption,
    ElInput,
    ElInputNumber,
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
    const title = computed(() => (type.value === 'add' ? '新增组织' : '修改组织'));
    const isShowModal = useVModel(props, 'visible');

    //#region form
    const formRef = ref();
    const formModel = reactive<OrgFormData>(cloneDeep(initialFormData));
    const formRules = {
      name: [
        { required: true, message: '请输入组织名称', trigger: 'blur' },
      ],
      abbr: [
        { required: true, message: '请输入简称', trigger: 'blur' },
      ],
      address: [
        { required: true, message: '请输入地址', trigger: 'blur' },
      ],
    };
    //#endregion

    watch([isShowModal, type], () => {
      Object.assign(formModel, {
        parentID: data.value.parentID,
      });
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
              orgName: formModel.name,
              shortName: formModel.abbr,
              addr: formModel.address,
              effective: formModel.isAvailable,
              showOrder: String(formModel.order),
              parentId: formModel.parentID,
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
