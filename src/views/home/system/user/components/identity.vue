<template>
  <ElDialog
    v-model="isShowModal"
    title="用户身份"
    :close-on-click-modal="false"
    destroy-on-close
    @close="onCancel"
  >
    <template #default>
      <ElRow
        class="dialog__header"
        justify="end"
      >
        <ElCol
          class="dialog__header-buttons"
          :span="6"
        >
          <ElButton
            type="primary"
            @click="onAdd"
          >
            新增
          </ElButton>
        </ElCol>
      </ElRow>
      <ElTable
        border
        :data="tableData"
        class="dialog__body"
      >
        <ElTableColumn
          label="人员身份名称"
          align="center"
          prop="name"
          show-overflow-tooltip
        />
        <ElTableColumn
          label="身份机构"
          align="center"
          prop="orgName"
          show-overflow-tooltip
        />
        <ElTableColumn
          label="是否主身份"
          align="center"
          prop="isMain"
        >
          <template #default="{ row }">
            {{ row.isMain === 'Y' ? '是' : '否' }}
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="是否有效"
          align="center"
          prop="isAvailable"
        >
          <template #default="{ row }">
            {{ row.isAvailable === 'Y' ? '是' : '否' }}
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="操作"
          align="center"
        >
          <template #default="{ row }">
            <ElSpace>
              <ElButton
                type="text"
                @click="onEdit(row)"
              >
                修改
              </ElButton>
            </ElSpace>
          </template>
        </ElTableColumn>
      </ElTable>
    </template>
  </ElDialog>
</template>

<script lang="ts">
import {
  defineComponent,
  toRefs,
  ref,
  watch,
  PropType,
} from 'vue';
import {
  ElDialog,
  ElRow,
  ElCol,
  ElTable,
  ElTableColumn,
  ElSpace,
  ElButton,
  ElMessage,
} from 'element-plus';
import { useVModel } from '@vueuse/core';
import type { UserIdentityData } from '../data.d';
import { searchUserIdentityByUser } from '../service';

interface ComponentProps {
  visible: boolean,
  userId: string,
}

interface TableRow {
  id: string,
  name: string,
  orgId: string,
  orgName: string,
  isMain: 'Y' | 'N',
  isAvailable: 'Y' | 'N',
  order: number,
}

export default defineComponent({
  name: 'UserIdentity',

  components: {
    ElDialog,
    ElRow,
    ElCol,
    ElTable,
    ElTableColumn,
    ElSpace,
    ElButton,
  },

  props: {
    visible: {
      type: Boolean,
      default: false,
    },

    userId: {
      type: String as PropType<ComponentProps['userId']>,
      default: '',
    },
  },

  emits: [
    'update:visible',
  ],

  setup(props: ComponentProps) {
    const { userId } = toRefs(props);
    const isShowModal = useVModel(props, 'visible');

    //#region 获取数据
    const tableData = ref<TableRow[]>();
    const fetchTableData = async () => {
      try {
        const { data: { success, obj, message } } = await searchUserIdentityByUser(userId.value);
        if (success) {
          tableData.value = obj.map((item) => ({
            id: item.id,
            name: item.userIdentityName,
            orgId: item.orgId,
            orgName: item.orgName,
            isMain: item.primaryIdentity,
            isAvailable: item.effective,
            order: Number(item.showOrder),
          }));
        } else {
          ElMessage.error(message);
        }
      } catch (e) {
        console.log('error', e);
      }
    };

    watch([isShowModal, userId], () => {
      if (isShowModal.value && userId.value) {
        fetchTableData();
      }
    });

    //#region 弹窗相关
    const isShowIdentityModal = ref(false);
    const type = ref<'add' | 'edit'>('add');
    const selectedData = ref<UserIdentityData>();
    const onAdd = () => {
      type.value = 'add';
      selectedData.value = {
        id: '',
        userId: userId.value,
        orgId: '',
        orgName: '',
        order: 1,
        identity: '',
        isMain: 'Y',
        isAvailable: 'Y',
      };
      isShowIdentityModal.value = true;
    };

    const onEdit = (row: TableRow) => {
      type.value = 'edit';
      selectedData.value = {
        id: row.id,
        userId: userId.value,
        orgId: row.orgId,
        orgName: row.orgName,
        order: row.order,
        identity: row.name,
        isMain: row.isMain,
        isAvailable: row.isAvailable,
      };
      isShowIdentityModal.value = true;
    };

    const onIdentitySubmitted = () => {
      fetchTableData();
    };
    //#endregion
    //#endregion

    const onCancel = () => {
      isShowModal.value = false;
    };

    return {
      isShowModal,
      tableData,
      onCancel,

      //#region 弹窗相关
      isShowIdentityModal,
      type,
      selectedData,
      onAdd,
      onEdit,
      onIdentitySubmitted,
      //#endregion
    };
  },
});
</script>

<style lang="scss" scoped>
.dialog {
  &__header {
    margin-bottom: 16px;

    &-buttons {
      text-align: right;
    }
  }
}
</style>
