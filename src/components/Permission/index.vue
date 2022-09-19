<template>
  <slot v-if="isPermission" />
  <slot
    v-else
    name="otherwise"
  >
    <result
      status="403"
      title="403"
      subtitle="抱歉，您没有访问此页面的权限。"
    >
      <template #extra>
        <router-link to="/">
          <el-button type="primary">
            返回首页
          </el-button>
        </router-link>
      </template>
    </result>
  </slot>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  PropType,
  ComputedRef,
} from 'vue';
// import { useStore } from 'vuex';
import { ElButton } from 'element-plus';
import Result from '@/components/Result/index.vue';
// import { StateType as UserStateType } from '@/views/user/store';
// import { hasPermissionRouteRoles } from '@/utils/routes';

interface ComponentProps {
  roles: string[] | string;
}

interface PermissionSetupData {
  isPermission: ComputedRef<boolean>;
}

export default defineComponent({
  name: 'Permission',

  components: {
    ElButton,
    Result,
  },

  props: {
    roles: {
      type: [String, Array] as PropType<ComponentProps['roles']>,
      default() {
        return [];
      },
    },
  },
  setup(): PermissionSetupData {
    // const store = useStore<{ user: UserStateType }>();

    // 是否有权限
    // const isPermission = computed(() => hasPermissionRouteRoles(
    //   store.state.user.currentUser.roles,
    //   props.roles,
    // ));
    const isPermission = computed(() => true);

    return {
      isPermission,
    };
  },
});
</script>
