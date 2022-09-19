<template>
  <ElForm
    ref="ruleForm2"
    :inline="true"
    label-width="0"
    :model="formModel"
    status-icon
    :rules="rules"
  >
    <ElFormItem
      :label="`${index + 1}.`"
      label-width="2em"
      prop="columnName"
    >
      <ElInput
        v-model="formModel.columnName"
        placeholder="字段名称"
        style="width:150px"
      />
    </ElFormItem>
    <ElFormItem
      label=""
      prop="length"
    >
      <ElInput
        v-model="formModel.length"
        placeholder="字段长度"
        style="width:90px"
      />
    </ElFormItem>
    <ElFormItem
      label=""
      prop="columnName"
    >
      <ElSelect
        v-model="formModel.dataType"
        placeholder="字段类型"
        style="width:120px"
      >
        <ElOption
          label="String"
          value="1"
        />
        <ElOption
          label="Integer"
          value="2"
        />
        <ElOption
          label="Date"
          value="3"
        />
        <ElOption
          label="Double"
          value="4"
        />
      </ElSelect>
    </ElFormItem>

    <ElFormItem
      label=""
      prop="columnComment"
    >
      <ElInput
        v-model="formModel.columnComment"
        style="width:210px"
        placeholder="请输入字段描述"
      />
    </ElFormItem>
    <ElFormItem
      label=""
      prop="isSearch"
    >
      <ElCheckbox
        v-model="formModel.isSearch"
        name="isSearch"
      >
        搜索字段
      </ElCheckbox>
    </ElFormItem>
    <ElFormItem>
      <span
        class="el-icon-delete delBtn"
        @click="onDel"
      />
    </ElFormItem>
  </ElForm>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import {
  ElInput, ElFormItem, ElForm, ElCheckbox, ElOption, ElSelect,
} from 'element-plus';
import { ReqParams } from '../data.d';

interface ComponentProps {
  data: ReqParams.ColList;
  index: number;
}
const colListDef: ReqParams.ColList = {
  columnComment: '',
  columnName: '',
  dataType: '1',
  isSearch: false,
  length: '10',
};
export default defineComponent({
  components: {
    ElInput,
    ElFormItem,
    ElForm,
    ElCheckbox,
    ElOption,
    ElSelect,
  },
  props: {
    data: {
      type: Object as PropType<ComponentProps['data']>,
      default: () => colListDef,
    },
    index: {
      type: Number as PropType<ComponentProps['index']>,
      default: () => 0,
    },
  },
  emits: ['del', 'change'],
  setup(props: ComponentProps, { emit }) {
    const formModel = ref<ReqParams.ColList>(props.data);
    const ruleForm2 = ref();

    const onDel = () => {
      emit('del', props.index);
    };

    const checkNull = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('不能为空'));
      }
      return true;
    };

    const getData = () => new Promise((r, j) => {
      ruleForm2.value.validate((isValid: boolean) => {
        if (isValid) {
          r(formModel);
        } else {
          j();
        }
      });
    });

    return {
      formModel,
      getData,
      onDel,
      rules: {
        bizName: [{ validator: checkNull, trigger: 'change' }],
        tabeSchema: [{ validator: checkNull, trigger: 'change' }],
        tableName: [{ validator: checkNull, trigger: 'change' }],
        rootPackage: [{ validator: checkNull, trigger: 'change' }],
        moduleName: [{ validator: checkNull, trigger: 'change' }],
        colList: [{ validator: checkNull, trigger: 'change' }],
        isCreate: [{ validator: checkNull, trigger: 'change' }],
      },
    };
  },

  //
});
</script>

<style lang="scss" scoped>
.delBtn {
  cursor: pointer;
  color: rgb(228, 74, 74);
  margin-left: 10px;
  &:active {
    color: rgb(150, 25, 25);
  }
}
</style>
