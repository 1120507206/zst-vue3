<template>
  <ElDialog
    v-model="isShowModal"
    title="角色关联用户"
    :close-on-click-modal="false"
    destroy-on-close
    width="60%"
    @close="onCancel"
  >
    <template #default>
      <ElRow :gutter="20">
        <ElCol :span="6">
          <ElScrollbar
            class="tree"
            height="450px"
          >
            <ElTree
              ref="org"
              :data="orgData"
              node-key="id"
              highlight-current
              empty-text="加载中，请稍后"
              :current-node-key="currentNodeKey"
              :props="orgTreeProps"
              @node-click="onNodeClick"
            />
          </ElScrollbar>
        </ElCol>
        <ElCol :span="18">
          <ElTransfer
            v-model="selectedUserID"
            :data="userData"
            filterable
            :props="{ key: 'id', label: 'name' }"
            :titles="['未关联', '已关联']"
            @change="onTransferChange"
          />
        </ElCol>
      </ElRow>
    </template>
  </ElDialog>
</template>

<script lang="ts">
import {
  defineComponent,
  toRefs,
  ref,
  watch,
  reactive,
  PropType,
} from 'vue';
import {
  ElDialog,
  ElRow,
  ElCol,
  ElScrollbar,
  ElTree,
  ElTransfer,
  ElMessage,
} from 'element-plus';
import { useVModel } from '@vueuse/core';
import { getOrgTree } from '@/views/home/system/org/service';
import type { ResResult as OrgResResult } from '@/views/home/system/org/data.d';
import {
  findRoleAndUser,
  findRoleNotRelateUser,
  relateUserAuth,
  cancelUserAuth,
} from '../service';
import { ReqParams } from '../data.d';

interface ComponentProps {
  visible: boolean,
  authId: string,
}

interface UserItem {
  id: string,
  name: string,
  isAvailable: 'Y' | 'N',
}

export default defineComponent({
  name: 'UserAssociate',

  components: {
    ElDialog,
    ElRow,
    ElCol,
    ElScrollbar,
    ElTree,
    ElTransfer,
  },

  props: {
    visible: {
      type: Boolean,
      default: false,
    },

    authId: {
      type: String as PropType<ComponentProps['authId']>,
      default: '',
    },
  },

  emits: [
    'update:visible',
    'submitted',
  ],

  setup(props: ComponentProps) {
    const { authId } = toRefs(props);
    const isShowModal = useVModel(props, 'visible');

    //#region 树
    const selectedOrg = ref<OrgResResult.OrgTreeItem>();
    const orgData = ref<OrgResResult.OrgTreeItem[]>([]);
    const currentNodeKey = ref('');
    const orgTreeProps = reactive({
      children: 'children',
      label: 'name',
    });

    //#region transfer
    const userData = ref<UserItem[]>([]);
    const selectedUserID = ref<string[]>([]);

    const fetchUserData = async () => {
      try {
        const [
          { data: unassociatedUser },
          { data: associatedUser },
        ] = await Promise.all([
          findRoleNotRelateUser({
            orgId: selectedOrg.value?.id as string,
            roleId: authId.value,
            searchKey: '',
          }),
          findRoleAndUser(authId.value),
        ]);
        if (unassociatedUser.success && associatedUser.success) {
          const unassociatedUserData = unassociatedUser.obj.map((item) => ({
            id: item.id,
            name: item.userIdentityName,
            isAvailable: item.effective,
          }));
          const associatedUserData = associatedUser.obj.map((item) => ({
            id: item.id,
            name: item.userIdentityName,
            isAvailable: item.effective,
          }));
          selectedUserID.value = associatedUserData.map((item) => item.id);
          userData.value = unassociatedUserData.concat(associatedUserData);
        } else {
          if (!unassociatedUser.success) {
            ElMessage.error(unassociatedUser.message);
          }

          if (!associatedUser.success) {
            ElMessage.error(associatedUser.message);
          }
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
      try {
        let resData;
        const params: ReqParams.RelateUserAuth = {
          authList: changedIdList,
          roleId: authId.value,
        };
        if (direction === 'left') {
          resData = await cancelUserAuth(params);
        } else {
          resData = await relateUserAuth(params);
        }
        const { data: { success, message } } = resData;
        if (success) {
          ElMessage.success(direction === 'left' ? '取消关联成功' : '关联成功');
        } else {
          ElMessage.error(message);
        }
      } catch (e) {
        console.error('error', e);
      }
    };
    //#endregion

    const fetchOrgData = async () => {
      try {
        const { data: { success, message, obj } } = await getOrgTree();
        if (success) {
          currentNodeKey.value = obj[0].id;
          selectedOrg.value = obj[0];
          orgData.value = obj;
          fetchUserData();
        } else {
          ElMessage.error(message);
        }
      } catch (e) {
        console.error('error', e);
      }
    };

    const onNodeClick = (data: OrgResResult.OrgTreeItem) => {
      currentNodeKey.value = data.id;
      selectedOrg.value = data;
      fetchUserData();
    };
    //#endregion

    watch([isShowModal, authId], () => {
      if (isShowModal.value && authId.value) {
        fetchOrgData();
      }
    });

    const onCancel = () => {
      isShowModal.value = false;
    };

    return {
      isShowModal,
      onCancel,

      //#region tree
      orgData,
      currentNodeKey,
      orgTreeProps,
      fetchOrgData,
      onNodeClick,
      //#endregion

      //#region transfer
      userData,
      selectedUserID,
      onTransferChange,
      //#endregion
    };
  },
});
</script>

<style lang="scss" scoped>

</style>
