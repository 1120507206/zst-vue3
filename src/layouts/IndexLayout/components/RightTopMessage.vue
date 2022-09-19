<template>
  <router-link
    to="/"
    class="indexlayout-top-message"
  >
    <i
      class="el-icon-bell"
      :style="{ fontSize: '16px' }"
    />
    <el-badge
      class="indexlayout-top-message-badge"
      :value="message"
      type="danger"
    />
  </router-link>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  ComputedRef,
} from 'vue';
// import { useStore } from 'vuex';
import { ElBadge } from 'element-plus';
// import { StateType as UserStateType } from '@/views/user/store';

interface RightTopMessageSetupData {
  message: ComputedRef<string>;
}

export default defineComponent({
  name: 'RightTopMessage',

  components: {
    ElBadge,
  },

  setup(): RightTopMessageSetupData {
    // const store = useStore<{ user: UserStateType }>();

    // const message = computed<string>(() => store.state.user.userInfo.id);
    const message = computed(() => '');

    onMounted(() => {
      // store.dispatch('user/fetchMessage');
    });

    return {
      message,
    };
  },
});
</script>

<style lang="scss" scoped>
@use '~@/assets/css/global.scss';

.indexlayout-top-message {
  display: inline-block;
  width: 24px;
  height: global.$headerHeight;
  /* display: inline-block; */
  line-height: global.$headerHeight;
  color: #c0c4cc;

  .indexlayout-top-message-badge {
    margin-left: -5px;
    margin-top: -20px;

    ::v-deep(.el-badge__content) {
      border: 0;
    }
  }
}
</style>
