<template>
  <ElDialog
    v-model="isShowModal"
    title="关联租户"
    :close-on-click-modal="false"
    destroy-on-close
    @close="onCancel"
  >
    <template #default>
      <div
        style="min-height: 40vh; max-height: 55vh; overflow: auto"
        class="ElTransfer"
      >
        <ElTransfer
          ref="TransRef"
          v-model="selectedUserID"
          :data="orgData"
          filterable
          :props="{ key: 'id', label: 'orgName' }"
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
import { Org } from '../service';

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
    ElTransfer,
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
    const selectedUserID = ref<string[]>([]);
    const changedIds = ref<string[]>([]);
    const orgData = ref<ResResult.OrgItem[]>([]);
    const TransRef = ref();
    const fetchTreeData = async () => {
      try {
        const {
          data: { success, obj },
        } = await Org.getUserList(teantId.value);
        if (success && obj) {
          selectedUserID.value = obj.map((it) => it.id);
        }
      } catch (e) {
        console.error('error', e);
      }
      try {
        const {
          data: { success, obj },
        } = await Org.getOrgList();
        if (success) {
          orgData.value = obj;
        }
      } catch (e) {
        console.error('error', e);
      }
    };

    watch([isShowModal, teantId], () => {
      if (isShowModal.value && teantId.value !== '') {
        changedIds.value = [];
        selectedUserID.value = [];
        orgData.value = [];
        fetchTreeData();
      }
    });

    const onCancel = () => {
      isShowModal.value = false;
    };

    const onConfirm = async () => {
      try {
        const params: ReqParams.setAuthByMenu = {
          authList: TransRef.value.modelValue,
          teantId: teantId.value,
        };
        const resData = await Org.setUserLinkToOrg(params);
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
      changedIdList: string[],
    ) => {
      // console.log('associatedIdList', associatedIdList, 'changedIdList', changedIdList);
      if (direction === 'right') {
        changedIds.value = changedIdList;
      }
    };

    return {
      isShowModal,
      orgData,
      selectedUserID,
      changedIds,

      fetchTreeData,
      onCancel,
      onConfirm,
      onTransferChange,
      TransRef,
    };
  },
});
</script>

<style lang="scss">
.ElTransfer .el-transfer-panel {
  width: 300px;
}
</style>
