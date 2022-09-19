<template>
  <ElDialog
    v-model="isShowModal"
    :title="type == 'add' ? '新增' : '编辑'"
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
        label="KEY"
        prop="key"
      >
        <ElInput
          v-model="formModel.key"
          type="text"
          autocomplete="off"
        />
      </ElFormItem>
      <ElFormItem
        label="名称"
        prop="name"
      >
        <ElInput
          v-model="formModel.name"
          type="text"
          autocomplete="off"
        />
      </ElFormItem>
      <ElFormItem
        label="描述"
        prop="description"
      >
        <ElInput
          v-model="formModel.description"
          :rows="3"
          type="textarea"
          autocomplete="off"
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
// import { cloneDeep } from 'lodash-es';
import {
  ElInput, ElFormItem, ElMessage, ElButton, ElDialog, ElForm,
} from 'element-plus';
import { useVModel } from '@vueuse/core';
import { Add as addDoc } from '../service';
import { ReqParams } from '../data.d';

interface ComponentProps {
  visible: boolean;
  type: 'add' | 'edit';
  //   data: ResResult.Rows;
}
// const initialFormData: ResResult.Rows = {
//   id: '',
//   type: '',
//   remark: '',
//   ckey: '',
//   cvalue: '',
// };

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

    // data: {
    //   type: Object as PropType<ComponentProps['data']>,
    //   default() {
    //     return cloneDeep(initialFormData);
    //   },
    // },
  },
  emits: ['update:visible', 'submitted'],
  setup(props, { emit }) {
    const { type } = toRefs(props);
    const checkNull = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('不能为空'));
      }
      return true;
    };

    const isShowModal = useVModel(props, 'visible');

    const ruleForm = ref();
    const formModel = reactive<ReqParams.add>({
      description: '',
      key: '',
      name: '',
    });

    const fetchApi = {
      add: addDoc,
    };

    const onCancel = () => {
      // ruleForm.value.resetFields();
      isShowModal.value = false;
    };

    const onConfirm = () => {
      ruleForm.value.validate(async (isValid: boolean) => {
        if (isValid) {
          try {
            const {
              data: { success, message, obj },
            } = await fetchApi[type.value]({ ...formModel });

            if (success) {
              ElMessage.success('添加成功');
              onCancel();
              emit('submitted', obj);
            } else {
              ElMessage.error(message);
            }
          } catch (error) {
            console.log('error', error);
          }
        }
      });
    };

    watch(isShowModal, (cur) => {
      console.log(cur);
      if (cur) return;
      ruleForm.value.resetFields();
    });

    return {
      isShowModal,

      ruleForm,
      formModel,
      rules: {
        key: [{ validator: checkNull, trigger: 'blur' }],
        name: [{ validator: checkNull, trigger: 'blur' }],
        description: [],
      },

      onConfirm,
      onCancel,
    };
  },
});
</script>
