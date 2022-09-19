<template>
  <ElDialog
    v-model="isShowModal"
    title="权限设置"
    :close-on-click-modal="false"
    destroy-on-close
    @close="onCancel"
  >
    <template #default>
      <div style="min-height: 40vh; max-height: 55vh; overflow: auto">
        1231231
      </div>
    </template>
    <template #footer>
      <div class="dialog__footer">
        <ElSpace>
          <ElButton
            type="default"
            @click="onCancel"
          >
            取消
          </ElButton>
          <ElButton
            type="primary"
            @click="onConfirm"
          >
            确定
          </ElButton>
        </ElSpace>
      </div>
    </template>
  </ElDialog>
</template>
<script lang="ts">
import {
  defineComponent, PropType, toRefs, watch,
} from 'vue';
import {
  ElDialog,
  ElSpace,
  ElButton,
  // ElMessage,
} from 'element-plus';

import { useVModel } from '@vueuse/core';
// import type { ResResult } from '../data.d';
// import { getMenuTree, saveMenuTeant } from '../service';

interface ComponentProps {
  visible: boolean;
  teantId: string;
}

export default defineComponent({
  name: 'SetLinkUser',
  components: {
    ElDialog,
    ElButton,
    ElSpace,
    // ElMessage,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },

    teantId: {
      type: String as PropType<ComponentProps['teantId']>,
      default: '',
    },
  },

  emits: ['update:visible'],
  setup(props: ComponentProps) {
    const { teantId } = toRefs(props);
    const isShowModal = useVModel(props, 'visible');

    const fetchTreeData = () => {
      //
    };

    watch([isShowModal, teantId], () => {
      if (isShowModal.value && teantId.value !== '') {
        fetchTreeData();
      }
    });

    const onCancel = () => {
      isShowModal.value = false;
    };

    const onConfirm = async () => {
      try {
        // tree设置了check-strictly之后，getHalfCheckedKeys只会返回空数组
        // console.log(treeRef.value.getCheckedKeys(), treeRef.value.getHalfCheckedKeys());
        // const { data: { success, message } } = await saveMenuTeant({
        //   authList: treeRef.value.getCheckedKeys(),
        //   teantId: teantId.value,
        // });
        // if (success) {
        //   ElMessage.success('修改成功');
        //   onCancel();
        // } else {
        //   ElMessage.error(message);
        // }
      } catch (e) {
        console.log('error', e);
      }
    };

    return {
      isShowModal,

      fetchTreeData,
      onCancel,
      onConfirm,
    };
  },
});
</script>
