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
        <ElFormItem label="账号" prop="name">
          <ElInput
            v-model="formModel.account"
            show-word-limit
            maxlength="30"
            type="textarea"
            placeholder="请输入"
          />
        </ElFormItem>
        <ElFormItem label="密码" prop="">
          <ElInput v-model="formModel.name" placeholder="请输入6-12位数字、字母组合字符"  />
        </ElFormItem>
        <ElFormItem label="手机号" prop="contactNumber"  placeholder="请输入">
          <ElInput v-model="formModel.contactNumber" />
        </ElFormItem>
        <ElFormItem label="姓名" prop="name"  placeholder="请输入">
          <ElInput v-model="formModel.name" show-word-limit maxlength="30" />
        </ElFormItem>

        <ElFormItem label="邮箱" prop="email"  placeholder="请输入">
          <ElInput v-model="formModel.email" show-word-limit maxlength="30" />
        </ElFormItem>
        <ElFormItem label="机构名称" prop="icon"  placeholder="请输入">
          <ElInput v-model="formModel.icon" show-word-limit maxlength="30" />
        </ElFormItem>
        <ElFormItem label="跟进人" >
          <el-select
            v-model="value"
            class="m-2"
            placeholder="Select"
            size="large"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </ElFormItem>
        <!-- <ElFormItem label="图标路径" prop="icon">
          <ElInput v-model="formModel.icon" />
        </ElFormItem> -->
      </ElForm>
    </template>
    <template #footer>
      <div class="dialog__footer">
        <ElSpace>
          <ElButton type="default" @click="onCancel">
            取消
          </ElButton>
          <ElButton type="primary" @click="onConfirm">
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
  import { phone, email } from '@/utils/validate';
  import type { UserFormData } from '../data.d';
  import { get, save } from '../service';

  interface ComponentProps {
    visible: boolean,
    type: 'add' | 'edit',
    userId: string,
    orgId: string,
  }

  const initialFormData: UserFormData = {
    id: '',
    account: '',
    name: '',
    gender: 'M',
    contactNumber: '',
    email: '',
    icon: '',
  };

  export default defineComponent({
    name: 'AddUser',

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

      userId: {
        type: String as PropType<ComponentProps['userId']>,
        default: '',
      },

      orgId: {
        type: String as PropType<ComponentProps['orgId']>,
        default: '',
      },
    },

    emits: [
      'update:visible',
      'submitted',
    ],

    setup(props: ComponentProps, { emit }) {
      const { type, userId, orgId } = toRefs(props);
      const title = computed(() => (type.value === 'add' ? '新增菜单' : '修改菜单'));
      const isShowModal = useVModel(props, 'visible');

      //#region form
      const formRef = ref();
      const formModel = reactive<UserFormData>(cloneDeep(initialFormData));
      const formRules = {
        account: [
          {
            required: true,
            message: '请输入账号',
            trigger: 'blur',
          },
        ],
        name: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur',
          },
        ],
        contactNumber: [
          {
          required: true,
            validator: phone,
            trigger: 'blur',
          },
        ],
        email: [
          {
          required: true,
            validator: email,
            trigger: 'blur',
          },
        ],
      };
      //#endregion

      //#region 获取数据
      const fetchUserData = async () => {
        try {
          const { data: { success, obj, message } } = await get(userId.value);
          if (success) {
            Object.assign(formModel, {
              id: obj.id,
              account: obj.account,
              name: obj.userName,
              gender: obj.gender,
              contactNumber: obj.contactNumber,
              email: obj.emailbox,
              icon: obj.iconPath,
            });
          } else {
            ElMessage.error(message);
          }
        } catch (e) {
          console.log('error', e);
        }
      };

      watch([isShowModal, type], () => {
        if (type.value === 'edit' && isShowModal.value) {
          fetchUserData();
          // Object.assign(formModel, data.value);
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
              } = await save({
                id: formModel.id,
                account: formModel.account,
                userName: formModel.name,
                gender: formModel.gender,
                contactNumber: formModel.contactNumber,
                emailbox: formModel.email,
                iconPath: formModel.icon,
                effective: 'Y',
                orgId: orgId.value,
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

<style lang="scss" scoped></style>
