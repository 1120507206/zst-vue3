<template>
  <ElDialog
    v-model="isShowModal"
    title="权限设置"
    :close-on-click-modal="false"
    destroy-on-close
    @close="onCancel"
  >
    <template #default>
      <ElTree
        ref="treeRef"
        check-strictly
        :data="menuTreeData"
        node-key="id"
        empty-text="加载中，请稍后"
        :props="defaultProps"
        show-checkbox
        :default-checked-keys="checkedIdList"
        @check="onCheckedChange"
      />
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
  defineComponent,
  PropType,
  ref,
  toRefs,
  watch,
} from 'vue';
import {
  ElDialog,
  ElTree,
  ElSpace,
  ElButton,
  ElMessage,
} from 'element-plus';
import { useVModel } from '@vueuse/core';
import type { ResResult } from '../data.d';
import { findMenuAuthTree, saveMenuRole } from '../service';

interface ComponentProps {
  visible: boolean,
  authId: string,
}

// 简单的递归，获取已选的ID
const getTreeCheckedItems = (tree: ResResult.TreeItem[], checkedIdList: string[]): string[] => {
  for (let i = 0, len = tree.length; i < len; i += 1) {
    const treeItem = tree[i];
    if (treeItem.checked) {
      checkedIdList.push(treeItem.id);
    }
    if (treeItem.children && treeItem.children.length) {
      getTreeCheckedItems(treeItem.children, checkedIdList);
    }
  }
  return checkedIdList;
};

export default defineComponent({
  name: 'SetAuth',

  components: {
    ElDialog,
    ElTree,
    ElSpace,
    ElButton,
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
  ],

  setup(props: ComponentProps) {
    const { authId } = toRefs(props);
    const isShowModal = useVModel(props, 'visible');

    //#region tree
    const treeRef = ref();
    const menuTreeData = ref<ResResult.TreeItem[]>();
    const checkedIdList = ref<string[]>([]);

    const fetchTreeData = async () => {
      try {
        const { data: { success, message, obj } } = await findMenuAuthTree(authId.value);
        if (success) {
          menuTreeData.value = obj;
          checkedIdList.value = getTreeCheckedItems(obj, []);
        } else {
          ElMessage.error(message);
        }
      } catch (e) {
        console.error('error', e);
      }
    };

    const onCheckedChange = () => {
      //
    };
    //#endregion

    watch([isShowModal, authId], () => {
      if (isShowModal.value && authId.value !== '') {
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
        const { data: { success, message } } = await saveMenuRole({
          authList: treeRef.value.getCheckedKeys(),
          roleId: authId.value,
        });
        if (success) {
          ElMessage.success('修改成功');
          onCancel();
        } else {
          ElMessage.error(message);
        }
      } catch (e) {
        console.log('error', e);
      }
    };

    return {
      isShowModal,
      onConfirm,
      onCancel,

      //#region tree
      treeRef,
      menuTreeData,
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      checkedIdList,
      onCheckedChange,
      //#endregion
    };
  },
});
</script>

<style lang="scss" scoped>

</style>
