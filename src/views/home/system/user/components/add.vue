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
        <ElFormItem label="账号" prop="account">
          <ElInput
            v-model="formModel.account"
            show-word-limit
            maxlength="30"

            placeholder="请输入"
          />
        </ElFormItem>
        <!-- <ElFormItem label="密码" prop="userPass">
          <ElInput v-model="formModel.userPass" placeholder="请输入6-12位数字、字母组合字符"  />
        </ElFormItem> -->
        <ElFormItem label="手机号" prop="contactNum"  placeholder="请输入">
          <ElInput v-model="formModel.contactNum" />
        </ElFormItem>
        <ElFormItem label="姓名" prop="name"  placeholder="请输入">
          <ElInput v-model="formModel.name" show-word-limit maxlength="30" />
        </ElFormItem>

        <ElFormItem label="邮箱" prop="email"  placeholder="请输入">
          <ElInput v-model="formModel.email" show-word-limit maxlength="30" />
        </ElFormItem>
        <ElFormItem label="机构名称" prop="orgName"  placeholder="请输入">
          <ElInput v-model="formModel.orgName" show-word-limit maxlength="30" />
        </ElFormItem>
        <ElFormItem label="跟进人" >
          <el-select
            v-model="formModel.contactsId"
            class="m-2"
            placeholder="Select"
            size="large"
          >
            <el-option
              v-for="item in contactsList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
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
    onMounted,
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
  import { get, save,getListPage ,searchUserOrg} from '../service';

  interface ComponentProps {
    visible: boolean,
    type: 'add' | 'edit',
    userId: string,
    orgId: string,
  }

  const initialFormData = {
    id: '',
    account: '',
    name: '',
    gender: 'M',
    contactNum: '',
    email: '',
    contactsId: '',
    icon: '',
    userPass: '',
    orgName: '',
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
      const formModel = reactive(cloneDeep(initialFormData));
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
        contactNum: [
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
const contactsList = ref<any>([])
  //查询条件
  const getPageData = async () => {
    const params = {
      pageIndex:'1',
      pageSize: '999',
    };
    const {
      data: { success, message, obj },
    } = await getListPage(params);
   contactsList.value = obj.data
   console.log('跟进人列表 :>> ', contactsList.value );
  };
  getPageData()
      //#region 获取数据
      const fetchUserData = async () => {
      const params = {
      id:userId.value
      }
        try {
          const { data: { success, obj, message } } = await searchUserOrg(params);
          if (success) {
            Object.assign(formModel, {
              id: obj.id,
              account: obj.account,
              name: obj.userName,
              gender: obj.gender,
              contactNum: obj.contactNumber,
              email: obj.email,
              icon: obj.iconPath,
              orgName: obj.orgName,
              contactsId: obj.contactsId,

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
                contactNum: formModel.contactNum,
                email: formModel.email,
                iconPath: formModel.icon,
                userPass: formModel.userPass,
                contactsId: formModel.contactsId,
                orgName: formModel.orgName,
                // effective: 'Y',
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
contactsList,
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
