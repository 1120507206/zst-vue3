<template>
  <div>
    <ElButtonGroup class="btn-group">
      <ElButton
        type="primary"
        icon="el-icon-plus"
        @click="onAddRows"
      >
        新增
      </ElButton>
      <ElPopover
        placement="right"
        title="选项"
        trigger="hover"
      >
        <template #reference>
          <ElButton
            type="primary"
            icon="el-icon-setting"
          />
        </template>
        <ElForm
          :model="addConfig"
          size="mini"
        >
          <ElFormItem
            label="添加行数"
            prop="num"
          >
            <ElInput
              v-model="addConfig.num"
              type="number"
              @blur="addConfig.num=(+addConfig.num)||1"
            />
          </ElFormItem>
          <ElFormItem
            label=""
            prop="scrollEnd"
          >
            <ElCheckbox v-model="addConfig.scrollEnd" />
            添加后滚动到底部
          </ElFormItem>
        </ElForm>
      </ElPopover>
    </ElButtonGroup>

    <ElTable
      ref="refTable"
      :data="tableData"
      border
      height="350"
    >
      <ElTableColumn
        v-for="(item) in tableConfig"
        :key="item.value"
        :width="item.width"
        :label="item.label"
        :prop="item.value"
        align="center"
      >
        <template
          #default="{
            row,
            $index
          }"
        >
          <template v-if="item.type === 'text'">
            {{ $index+1 }}
          </template>
          <template v-else-if="item.type === 'input'">
            <ElInput
              v-model="row[item.value]"
              :disabled="row.disabled"
              :placeholder="item.placeholder"
            />
            <!-- <input
              v-model="row[item.value]"
              :disabled="row.disabled"
              :placeholder="item.placeholder"
            /> -->
          </template>
          <template v-else-if="item.type === 'select'">
            <ElSelect
              v-model="row[item.value]"
              :disabled="row.disabled"
            >
              <ElOption
                v-for="opt in fieldType"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </ElSelect>
            <!-- <select
              v-model="row[item.value]"
              :disabled="row.disabled"
            >
              <option
                v-for="opt in fieldType"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </select> -->
          </template>
          <template v-else-if="item.type === 'check'">
            <ElCheckbox v-model="row[item.value]" />
            <!-- <input
              type="checkbox"
              v-model="row[item.value]"
            /> -->
          </template>
        </template>
      </ElTableColumn>
    </ElTable>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  ref,
  reactive,
  nextTick,
  PropType,
} from 'vue';
import {
  ElButtonGroup,
  ElButton,
  ElPopover,
  ElForm,
  ElFormItem,
  ElTable,
  ElTableColumn,
  ElInput,
  ElSelect,
  ElOption,
  ElCheckbox,
} from 'element-plus';
import { ReqParams } from '../data.d';

export default defineComponent({
  name: 'DBProp',
  components: {
    ElButtonGroup,
    ElButton,
    ElPopover,
    ElForm,
    ElFormItem,
    ElTable,
    ElTableColumn,
    ElInput,
    ElSelect,
    ElOption,
    ElCheckbox,
  },
  props: {
    data: {
      type: Array as PropType<ReqParams.ColumnsDTO>,
      default: () => [],
    },
  },
  setup(props) {
    const tableConfig = [
      {
        label: '#',
        value: 'index',
        type: 'text',
        width: 50,
      },
      {
        label: '字段名称',
        value: 'columnName',
        type: 'input',
        placeholder: '请输入字段名称',
      },
      {
        label: '字段备注',
        value: 'columnComment',
        type: 'input',
        placeholder: '请输入字段备注',
      },
      {
        label: '字段长度',
        value: 'length',
        type: 'input',
      },
      {
        label: '字段类型',
        value: 'dataType',
        type: 'select',
      },
      {
        label: '是否搜索字段',
        value: 'isSearch',
        type: 'check',
      },
      {
        label: '是否列表显示',
        value: 'listDisplay',
        type: 'check',
      },
    ];
    const fieldType = [
      {
        label: 'String',
        value: 1,
      },
      {
        label: 'Integer',
        value: 2,
      },
      {
        label: 'Double',
        value: 4,
      },
      {
        label: 'Date',
        value: 3,
      },
    ];
    const tableData = computed(() => props.data);

    // console.log(tableData);

    const addConfig = reactive({
      num: 1,
      //   position: 0,
      scrollEnd: true,
    });

    const refTable = ref();

    const onAddRows = () => {
      const newRows = new Array(+addConfig.num);
      console.log(newRows);
      newRows.fill({
        columnName: '',
        columnComment: '',
        dataType: 1,
        length: 0,
        isSearch: false,
        listDisplay: false,
      }, 0, addConfig.num);
      tableData.value.push(...JSON.parse(JSON.stringify(newRows)));

      nextTick(() => {
        if (addConfig.scrollEnd) {
          const scrollTarget = refTable.value.$el.querySelector('.el-table__body-wrapper');
          scrollTarget.scroll(0, scrollTarget.scrollHeight);
        }
      });
    };

    return {
      tableConfig,
      fieldType,
      addConfig,
      tableData,

      onAddRows,

      refTable,
    };
  },
});
</script>

<style lang="scss" scoped>
.btn-group {
  margin-bottom: 16px;
}
</style>
