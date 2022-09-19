<template>
  <div class="main">
    <h1 class="title">
      账户登录
    </h1>
    <el-form
      ref="formRef"
      :model="modelRef"
      :rules="rulesRef"
    >
      <el-form-item
        label=""
        prop="username"
      >
        <el-input
          v-model="modelRef.username"
          placeholder="请输入用户姓名"
          @keydown.enter="handleSubmit"
        >
          <template #prefix>
            <i class="el-icon-user el-input__icon" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item
        label=""
        prop="password"
      >
        <el-input
          v-model="modelRef.password"
          type="password"
          placeholder="请输入登录密码"
          @keydown.enter="handleSubmit"
        >
          <template #prefix>
            <i class="el-icon-unlock el-input__icon" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          class="submit"
          :loading="submitLoading"
          @click="handleSubmit"
        >
          登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { find } from 'lodash-es';
import {
  defineComponent, reactive, ref, Ref,
} from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import {
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElMessage,
} from 'element-plus';
import { StateType as GlobalStateType } from '@/store/global';
import { StateType as UserLoginStateType } from './store';
import { ReqParams } from './data.d';
import { FormRulesMap } from '@/shims-vue.d';

  interface LoginForm {
    username: string;
    password: string;
  }

  interface UserLoginSetupData {
    modelRef: LoginForm;
    rulesRef: FormRulesMap;
    formRef: Ref<typeof ElForm | undefined>;
    submitLoading: Ref<boolean>;
    handleSubmit: () => Promise<void>;
  }

export default defineComponent({
  name: 'UserLogin',

  components: {
    ElForm,
    ElFormItem,
    ElInput,
    ElButton,
  },

  setup(): UserLoginSetupData {
    const router = useRouter();
    const { currentRoute } = router;
    const { state, dispatch, commit } = useStore<{
        global: GlobalStateType;
        user: UserLoginStateType;
      }>();
      // 表单值
    const modelRef = reactive<LoginForm>({
      username: '',
      password: '',
    });
      // 表单验证
    const rulesRef = reactive({
      username: [
        {
          required: true,
          message: '请输入用户姓名',
        },
      ],
      password: [
        {
          required: true,
          message: '请输入登录密码',
        },
      ],
    });

    // form
    const formRef = ref<typeof ElForm>();

    // 登录loading
    const submitLoading = ref<boolean>(false);

    // 登录
    const handleSubmit = async () => {
      submitLoading.value = true;

      try {
        const valid: boolean | undefined = await formRef.value?.validate();
        if (valid === true) {
          const res: boolean = await dispatch('user/login', {
            userName: modelRef.username,
            userPass: modelRef.password,
            platformCode: 'TAX-ONE-STOP-IOT',
          } as ReqParams.Login);
          if (res) {
            ElMessage.success('登录成功');
            const { redirect, ...query } = currentRoute.value.query;
            if (
              state.global.hasTabNav
                && state.global.tabNavData.length === 0
            ) {
              const currentRouteMenu = find(
                state.user.authList,
                (item) => item.menuUrl === redirect,
              );
              const hasHomeAuth = state.user.authList.find(
                (item) => item.menuUrl === '/home',
              );
              if (hasHomeAuth) {
                commit('global/addTabNav', {
                  title: '首页',
                  path: '/home/index',
                  notClosable: true,
                });
              }
              if (currentRouteMenu) {
                commit('global/addTabNav', {
                  title: currentRouteMenu.menuName,
                  path: currentRouteMenu.menuUrl,
                });
              }
              //  else if (redirect === '/home/changePwd') {
              //   // 登录后手动判断是否是修改密码界面
              //   commit('global/addTabNav', {
              //     title: '修改密码',
              //     path: redirect,
              //   });
              // }
            }

            router.replace({
              path: (redirect as string) || '/',
              query: {
                ...query,
              },
            });
          }
        }
      } catch (error) {
        // console.log(error);
        ElMessage.warning('登录失败');
      }
      submitLoading.value = false;
    };

    return {
      modelRef,
      rulesRef,
      formRef,
      submitLoading,
      handleSubmit,
    };
  },
});
</script>
<style lang="scss" scoped>
  .main {
    flex: none;
    width: 248px;
    padding: 36px;
    margin: 0 auto;
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 0.2);

    .title {
      font-size: 28px;
      margin-top: 0;
      margin-bottom: 30px;
      text-align: center;
      color: #ffffff;
      /* background-image:-webkit-linear-gradient(right,#FFFFFF,#009688, #FFFFFF);
        -webkit-background-clip: text;
        -webkit-text-fill-color:transparent; */
    }

    .submit {
      width: 100%;
    }
  }
</style>
