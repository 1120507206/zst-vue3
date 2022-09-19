<template>
  <ElDialog
    v-model="isShowModal"
    :title="(type === 'add' ? '新增' : '编辑') + '租户'"
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
        label="公司名称"
        prop="companyName"
      >
        <ElInput
          v-model="formModel.companyName"
          type="text"
          autocomplete="off"
        />
      </ElFormItem>

      <ElFormItem
        label="联系人"
        prop="contacts"
      >
        <ElInput
          v-model="formModel.contacts"
          type="text"
          autocomplete="off"
        />
      </ElFormItem>
      <ElFormItem
        label="联系人电话"
        prop="telephone"
      >
        <ElInput
          v-model="formModel.telephone"
          type="text"
          autocomplete="off"
          maxlength="11"
        />
      </ElFormItem>
      <ElFormItem
        label="邮箱"
        prop="email"
      >
        <ElInput
          v-model="formModel.email"
          type="text"
          autocomplete="off"
        />
      </ElFormItem>
      <ElFormItem
        label="地址"
        prop="addr"
      >
        <ElInput
          v-model="formModel.addr"
          type="text"
          autocomplete="off"
        />
      </ElFormItem>
      <ElFormItem
        label="状态"
        prop="status"
      >
        <ElSwitch
          v-model="formModel.status"
          active-value="Y"
          inactive-value="N"
          active-text="有效"
          inactive-text="无效"
        />
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
  ElInput, ElFormItem, ElMessage, ElButton, ElDialog, ElForm, ElSwitch,
} from 'element-plus';
import { useVModel } from '@vueuse/core';
import { addDoc } from '../service';
import { ResResult } from '../data.d';
import { initialFormData, isTelPhone, isEmail } from '../initialData';

interface ComponentProps {
  visible: boolean;
  type: 'add' | 'edit';
  data: ResResult.Rows;
}

export default defineComponent({
  components: {
    ElDialog,
    ElInput,
    ElFormItem,
    ElForm,
    ElButton,
    ElSwitch,
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

    const checkEmail = (rule, value, callback) => {
      if (value && !isEmail(value)) {
        return callback(new Error('请输入合法的邮箱地址'));
      }
      return true;
    };
    const checkTelPhone = (rule, value, callback) => {
      if (!isTelPhone(value)) {
        return callback(new Error('请输入合法的手机号码'));
      }
      return true;
    };
    const isShowModal = useVModel(props, 'visible');
    const ruleForm = ref();

    const formModel = reactive<ResResult.Rows>(cloneDeep(initialFormData));
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
              ...formModel,
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
        companyName: [{ validator: checkNull, trigger: 'blur' }],
        contacts: [{ validator: checkNull, trigger: 'blur' }],
        telephone: [{ validator: checkTelPhone, trigger: 'blur' }],
        email: [{ validator: checkEmail, trigger: 'blur' }],
      },
    };
  },
});
</script>
