<template>
  <ElDialog
    v-model="isShowModal"
    :title="type == 'add' ? '新增字典' : '编辑字典'"
    width="40%"
  >
    <ElForm
      ref="ruleForm"
      :model="formModel"
      status-icon
      :rules="rules"
      label-width="100px"
      class="demo-ruleForm"
    >
      <ElFormItem
        label="字典Key"
        prop="ckey"
      >
        <ElInput
          v-model="formModel.ckey"
          type="text"
          autocomplete="off"
        />
      </ElFormItem>

      <ElFormItem
        label="字典值"
        prop="cvalue"
      >
        <ElInput
          v-model="formModel.cvalue"
          type="text"
          autocomplete="off"
        />
      </ElFormItem>
      <ElFormItem
        label="类型"
        prop="type"
      >
        <ElInput v-model="formModel.type" />
      </ElFormItem>
      <ElFormItem
        label="备注"
        prop="remark"
      >
        <ElInput
          v-model="formModel.remark"
          type="textarea"
        />
      </ElFormItem>
    </ElForm>
    <template #footer>
      <span class="dialog-footer">
        <ElButton @click="onCancel">取 消</ElButton>
        <ElButton
          type="primary"
          @click="onConfirm"
        >确 定</ElButton>
      </span>
    </template>
  </ElDialog>
</template>
<script lang="ts">
import {
  defineComponent, PropType, reactive, ref, watch, toRefs,
} from 'vue';
import { cloneDeep } from 'lodash-es';
import {
  ElInput, ElFormItem, ElMessage, ElButton, ElDialog, ElForm,
} from 'element-plus';
import { useVModel } from '@vueuse/core';
import { addDoc } from '../service';
import { ResResult } from '../data.d';

interface ComponentProps {
  visible: boolean;
  type: 'add' | 'edit';
  data: ResResult.Rows;
}
const initialFormData: ResResult.Rows = {
  id: '',
  type: '',
  remark: '',
  ckey: '',
  cvalue: '',
};

export default defineComponent({
  components: {
    ElDialog,
    ElInput,
    ElFormItem,
    ElForm,
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
  emits: ['update:visible', 'submitted'],
  setup(props: ComponentProps, { emit }) {
    const { type, data } = toRefs(props);
    const checkNull = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('不能为空'));
      }
      return true;
    };
    const isShowModal = useVModel(props, 'visible');
    const ruleForm = ref();

    const formModel = reactive<ResResult.Rows>({
      id: '',
      type: '',
      remark: '',
      ckey: '',
      cvalue: '',
    });
    watch([isShowModal, type], () => {
      Object.assign(formModel, data.value);
    });

    const onCancel = () => {
      ruleForm.value.resetFields();
      isShowModal.value = false;
    };

    const onConfirm = () => {
      ruleForm.value.validate(async (isValid: boolean) => {
        if (isValid) {
          console.log(formModel, data);
          try {
            const {
              data: { success, message },
            } = await addDoc({
              id: formModel.id,
              type: formModel.type,
              ckey: formModel.ckey,
              cvalue: formModel.cvalue,
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
      ruleForm,
      formModel,
      onConfirm,
      onCancel,
      isShowModal,
      rules: {
        type: [{ validator: checkNull, trigger: 'blur' }],
        remark: [{ validator: checkNull, trigger: 'blur' }],
        ckey: [{ validator: checkNull, trigger: 'blur' }],
        cvalue: [{ validator: checkNull, trigger: 'blur' }],
      },
    };
  },
});
</script>
