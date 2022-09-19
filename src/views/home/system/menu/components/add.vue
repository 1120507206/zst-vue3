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
          label="菜单名称"
          prop="name"
        >
          <ElInput v-model="formModel.name" />
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
          label="菜单路径"
          prop="path"
        >
          <ElInput v-model="formModel.path" />
        </ElFormItem>
        <ElFormItem label="图标">
          <ElInput v-model="formModel.icon" />
        </ElFormItem>
        <ElFormItem
          label="菜单类型"
          prop="type"
        >
          <ElSelect
            v-model="formModel.type"
            placeholder="请选择"
          >
            <ElOption
              label="控件"
              value="control"
            />
            <ElOption
              label="表单"
              value="form"
            />
            <ElOption
              label="菜单"
              value="menu"
            />
          </ElSelect>
        </ElFormItem>
        <ElFormItem
          label="菜单描述"
          prop="desc"
        >
          <ElInput
            v-model="formModel.desc"
            type="textarea"
            resize="none"
            :auto-size="{ minRows: 2, maxRows: 5 }"
            show-word-limit
            :maxlength="500"
          />
        </ElFormItem>
        <ElFormItem label="是否有效">
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
        <ElFormItem
          v-if="!formModel.id"
          label="是否为子菜单"
        >
          <ElSwitch v-model="formModel.isSubmenu" />
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
  ElSwitch,
  ElSpace,
  ElButton,
  ElMessage,
} from 'element-plus';
import { useVModel } from '@vueuse/core';
import type { MenuFormData } from '../data.d';
import { save } from '../service';

interface ComponentProps {
  visible: boolean,
  type: 'add' | 'edit',
  data: MenuFormData,
}

const initialFormData: MenuFormData = {
  id: '',
  name: '',
  order: 1,
  path: '',
  icon: '',
  type: 'menu',
  desc: '',
  parentID: '',
  isAvailable: 'Y',
  isSubmenu: false,
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
    ElSwitch,
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
    const title = computed(() => (type.value === 'add' ? '新增菜单' : '修改菜单'));
    const isShowModal = useVModel(props, 'visible');

    //#region form
    const formRef = ref();
    const formModel = reactive<MenuFormData>(cloneDeep(initialFormData));
    const formRules = {
      name: [
        { required: true, message: '请输入菜单名称', trigger: 'blur' },
      ],
      path: [
        { required: true, message: '请输入菜单路径', trigger: 'blur' },
      ],
      type: [
        { required: true, message: '请选择菜单类型', trigger: 'blur' },
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
              effective: formModel.isAvailable,
              iconPath: formModel.icon,
              menuDescription: formModel.desc,
              menuName: formModel.name,
              menuOrder: String(formModel.order),
              menuType: formModel.type,
              menuUrl: formModel.path,
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
