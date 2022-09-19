<template>
  <div style="width: 60%;">
    <ElForm
      ref="formRef"
      :label-width="150"
      :rules="rules"
      :model="formModel"
    >
      <ElFormItem
        label="旧密码"
        prop="oldPwd"
      >
        <ElInput
          v-model="formModel.oldPwd"
          show-password
          type="password"
        />
      </ElFormItem>
      <ElFormItem
        label="新密码"
        prop="newPwd"
      >
        <ElInput
          v-model="formModel.newPwd"
          show-password
          type="password"
        />
      </ElFormItem>
      <ElFormItem
        label="新密码确认"
        prop="newPwdValidate"
      >
        <ElInput
          v-model="formModel.newPwdValidate"
          show-password
          type="password"
        />
      </ElFormItem>
      <ElFormItem>
        <ElButton @click="reset">
          清空
        </ElButton>
        <ElButton
          type="primary"
          @click="submit"
        >
          提交
        </ElButton>
      </ElFormItem>
    </ElForm>
  </div>
</template>

<script lang="ts">
import md5 from 'blueimp-md5';
import {
  defineComponent,
  ref,
  reactive,
} from 'vue';
import {
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElMessage,
} from 'element-plus';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { StateType as UserLoginStateType } from './store';
import { password } from '@/utils/validate';
import { changePwd } from './service';
import { FormItemRule, ValidateCallback } from '@/shims-vue.d';

export default defineComponent({
  name: 'ChangePwd',
  components: {
    ElForm,
    ElFormItem,
    ElInput,
    ElButton,
  },
  setup() {
    const router = useRouter();
    const store = useStore<{
      user: UserLoginStateType,
    }>();
    const { state, commit, dispatch } = store;

    const formRef = ref();
    const formModel = reactive({
      oldPwd: '',
      newPwd: '',
      //   newPwdValidate: '',
    });
    const logout = async () => {
      commit('global/clearTabNav');
      const res: boolean = await dispatch('user/logout');
      if (res) {
        router.replace({
          path: '/user/login',
          query: {
            redirect: '/home/index',
          },
        });
      }
    };
    const reset = () => {
      formRef.value.resetFields();
      //   console.log(formRef);
    };
    const submit = () => {
      formRef.value.validate(async (valid) => {
        if (valid) {
          try {
            const { data: { status, message, success } } = await changePwd({
              userId: state.user.userInfo.userId,
              odlPass: md5(formModel.oldPwd),
              userPass: md5(formModel.newPwd),
            });
            if (status === 200 && success) {
              ElMessage.success(message);
              logout();
            } else {
              ElMessage.error(message);
            }
          } catch (error) {
            console.log(error);
          }
        }
      });
    };

    return {
      formRef,
      formModel,
      submit,
      reset,
      rules: {
        oldPwd: [
          {
            required: true,
            message: '请输入当前密码',
          },
        ],
        newPwd: [
          {
            required: true,
            message: '请输入密码',
          },
          {
            validator: password,
          },
        ],
        newPwdValidate: [
          {
            required: true,
            message: '请重新输入新密码',
          },
          {
            validator: (rule: FormItemRule, value: string, callback: ValidateCallback): void => {
              if (value !== formModel.newPwd) {
                callback(new Error('密码输入不一致'));
              } else {
                callback();
              }
            },
          },
        ],
      },
    };
  },
});
</script>
