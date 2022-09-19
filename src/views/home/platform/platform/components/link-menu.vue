<template>
  <ElDialog
    v-model="isShowModal"
    title="菜单关联"
    :close-on-click-modal="false"
    destroy-on-close
    width="880px"
    @close="onCancel"
  >
    <template #default>
      <div
        style="min-height: 40vh; max-height: 55vh; overflow: hidden;overflow-y:auto"
        class="ElTransfer"
      >
        <ElTransfer
          ref="TransRef"
          v-model="selectedUserID"
          :data="orgData"
          filterable
          :props="{ key: 'id', label: 'menuName' }"
          :titles="['未关联', '已关联']"
          @change="onTransferChange"
        />
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
  defineComponent, PropType, ref, toRefs, watch,
} from 'vue';
import {
  ElDialog,
  ElSpace,
  ElButton,
  ElTransfer,
  ElMessage,
} from 'element-plus';

import { useVModel } from '@vueuse/core';
import type { ReqParams, ResResult } from '../data.d';
import { MenuLinkList } from '../service';

interface ComponentProps {
  visible: boolean;
  platformId: string;
}

export default defineComponent({
  name: 'SetLinkMenu',
  components: {
    ElDialog,
    ElButton,
    ElSpace,
    ElTransfer,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },

    platformId: {
      type: String as PropType<ComponentProps['platformId']>,
      default: '',
    },
  },

  emits: ['update:visible'],
  setup(props: ComponentProps) {
    const { platformId } = toRefs(props);
    const isShowModal = useVModel(props, 'visible');
    const selectedUserID = ref<string[]>([]);
    const orgData = ref<ResResult.menuList[]>([]);
    const TransRef = ref();

    const fetchTreeData = async () => {
      try {
        const { data: { success, obj } } = await MenuLinkList.getRelateList(platformId.value);
        if (success && obj) {
          selectedUserID.value = obj.map((it) => it.id);
        }
      } catch (e) {
        console.error('error', e);
      }
      try {
        const { data: { success, obj } } = await MenuLinkList.getMenuList();
        if (success) {
          orgData.value = obj;
        }
      } catch (e) {
        console.error('error', e);
      }
    };

    watch([isShowModal, platformId], () => {
      if (isShowModal.value && platformId.value !== '') {
        // changedIds.value = [];
        selectedUserID.value = [];
        orgData.value = [];
        fetchTreeData();
      }
    });

    const onCancel = () => {
      isShowModal.value = false;
    };

    const onConfirm = async () => {
      //
      console.log('TransRef', TransRef.value.modelValue);
      try {
        const params: ReqParams.setLink = {
          // authList: changedIds.value,
          authList: TransRef.value.modelValue,
          platformId: platformId.value,
        };
        const resData = await MenuLinkList.setLink(params);
        const {
          data: { success, message },
        } = resData;
        if (success) {
          ElMessage.success('操作成功');
          onCancel();
        } else {
          ElMessage.error(message);
        }
      } catch (e) {
        console.error('error', e);
      }
    };

    const onTransferChange = async (
      associatedIdList: string[],
      direction: 'left' | 'right',
    ) => {
      // console.log('associatedIdList', associatedIdList, 'changedIdList', changedIdList);
      if (direction === 'right') {
        // changedIds.value = changedIdList;
      }
    };

    return {
      isShowModal,
      TransRef,
      orgData,
      selectedUserID,

      fetchTreeData,
      onCancel,
      onConfirm,
      onTransferChange,
    };
  },
});
</script>

<style lang="scss">
.ElTransfer .el-transfer-panel {
  width: 300px;
}
</style>
