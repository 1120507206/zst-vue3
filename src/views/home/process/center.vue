<template>
  <main class="main">
    <ElRow
      class="main__header"
      justify="space-between"
      :gutter="20"
    >
      <ElCol :span="6">
        <ElRadioGroup v-model="selectedRadio">
          <ElRadioButton label="待办" />
          <ElRadioButton label="已办" />
        </ElRadioGroup>
      </ElCol>
      <ElCol
        :span="6"
        class="main__buttons"
      >
        <ElButton
          type="default"
          @click="isShowMore = !isShowMore"
        >
          查看更多
        </ElButton>
      </ElCol>
    </ElRow>
    <ProcessTable
      :simple="!isShowMore"
      :type="selectedRadio === '待办' ? 'todo' : 'done'"
    />
  </main>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
} from 'vue';
// import { useStore } from 'vuex';
// import { useRouter } from 'vue-router';
import {
  ElRow,
  ElCol,
  ElRadioGroup,
  ElRadioButton,
  ElButton,
} from 'element-plus';
import ProcessTable from '@/views/home/process/components/table.vue';
// import type { StateType as GlobalStateType } from '@/store/global';
// import type { StateType as UserLoginStateType } from '@/views/user/store';
// import useAddTabNav from '@/composables/useAddTabNav';

export default defineComponent({
  name: 'Home',

  components: {
    ElRow,
    ElCol,
    ElRadioGroup,
    ElRadioButton,
    ElButton,
    ProcessTable,
  },

  setup() {
    // const router = useRouter();
    // const store = useStore<{
    //   global: GlobalStateType,
    //   user: UserLoginStateType,
    // }>();

    const selectedRadio = ref<'待办' | '已办'>('待办');
    const isShowMore = ref(false);

    // const onShowMore = () => {
    //   // useAddTabNav(store, router, selectedRadio.value === '待办' ? {
    //   //   title: '待办流程',
    //   //   path: '/process/todo',
    //   // } : {
    //   //   title: '已办流程',
    //   //   path: '/process/done',
    //   // });
    // };

    return {
      selectedRadio,
      isShowMore,
    };
  },
});
</script>

<style lang="scss" scoped>
.main {
  &__header {
    margin-bottom: 20px;
  }

  &__buttons {
    text-align: right;
  }
}
</style>
