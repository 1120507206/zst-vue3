<template>
  <div>
    <ElButtonGroup class="btn-group">
      <ElButton
        type="primary"
        icon="el-icon-setting"
        @click="isVisible = true"
      >
        表单配置
      </ElButton>
    </ElButtonGroup>

    <ElDialog
      v-model="isVisible"
      title="表单配置"
      custom-class="dialog__custom-form"
      append-to-body
      fullscreen
    >
      <CustomForm />

      <template #footer>
        <div>
          <ElButton @click="onClose">关闭</ElButton>
          <ElButton
            type="primary"
            @click="onSave"
          >
            保存
          </ElButton>
        </div>
      </template>
    </ElDialog>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  PropType,
} from 'vue';
import {
  ElButtonGroup,
  ElButton,
  ElDialog,
} from 'element-plus';
import CustomForm from '@/components/CustomForm/index.vue';
import { ReqParams } from '../data.d';

export default defineComponent({
  name: 'PageProp',
  components: {
    ElButtonGroup,
    ElButton,
    ElDialog,

    CustomForm,
  },
  props: {
    data: {
      type: Array as PropType<ReqParams.ColumnsDTO>,
      default: () => [],
    },
  },
  setup() {
    const isVisible = ref(true);

    const onClose = () => {
      isVisible.value = false;
    };

    const onSave = () => {
      isVisible.value = false;
    };

    return {
      isVisible,

      //#region events
      onClose,
      onSave,
      //#endregion
    };
  },
});
</script>

<style lang="scss" scoped>
.btn-group {
  margin-bottom: 16px;
}
</style>
