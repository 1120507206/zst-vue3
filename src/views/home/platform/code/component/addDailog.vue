<template>
  <ElDialog
    v-model="isShowModal"
    title="新建表"
    :close-on-click-modal="false"
    destroy-on-close
    width="50%"
  >
    <template #default>
      <div style="min-height: 40vh; max-height: 60vh; overflow: hidden; overflow-y: auto">
        <FormList
          type="add"
          :table-schema="tableSchema"
          :is-create="true"
        />
      </div>
    </template>
  </ElDialog>
</template>
<script lang="ts">
import { defineComponent, PropType, watch } from 'vue';
import { ElDialog } from 'element-plus';
import { useVModel } from '@vueuse/core';

import FormList from './formList.vue';

interface ComponentProps {
  visible: boolean;
  tableSchema: string;
}

export default defineComponent({
  name: 'AddTabel',
  components: {
    ElDialog,
    FormList,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },

    tableSchema: {
      type: String as PropType<ComponentProps['tableSchema']>,
      default: '',
    },
  },

  emits: ['update:visible'],
  setup(props: ComponentProps) {
    const isShowModal = useVModel(props, 'visible');

    watch(isShowModal, (n) => {
      if (n) {
        // console.log('isShowModal', isShowModal);
      }
    });

    return {
      isShowModal,
    };
  },
});
</script>
