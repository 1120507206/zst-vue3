<template>
  <main class="main">
    <ElRow
      class="main__header"
      justify="end"
    >
      <ElCol
        class="main__header-buttons"
        :span="6"
      >
        <ElButton
          :disabled="!(tableData && tableData.length)"
          @click="onReset"
        >
          返回
        </ElButton>
        <ElButton
          type="primary"
          :disabled="!(tableData && tableData.length)"
          @click="onNew"
        >
          新建表
        </ElButton>
      </ElCol>
    </ElRow>
    <template v-if="tableData && tableData.length">
      <div style="padding:0 5% 5vh">
        <ElRow
          justify="space-between"
          :gutter="50"
        >
          <ElCol :span="12">
            <ElCard
              shadow="never"
              class="cardh"
            >
              <ElForm
                ref="formRef"
                inline
                :model="searchModel"
                label-width="5em"
              >
                <ElFormItem
                  label="数据库:"
                  prop="tableSchema"
                  style="margin-bottom:0"
                >
                  {{ saveForm.tableSchema }}
                </ElFormItem>
                <ElFormItem
                  label="表名"
                  prop="tableName"
                  style="margin-bottom:0"
                >
                  <ElInput
                    v-model="searchModel.tableName"
                    clearable
                    placeholder="请输入表名包含字符"
                  />
                </ElFormItem>
              </ElForm>
              <ElDivider />
              <ElTree
                ref="TreeRef"
                class="tree"
                accordion
                highlight-current
                :data="tableData"
                :props="defaultProps"
                :load="loadNode"
                lazy
                :filter-node-method="filterNode"
              >
                <template #default="{ node, data }">
                  <span class="custom-tree-node">
                    <span
                      class="label"
                      :class="node.level === 2 && 'label2'"
                    >{{ node.label }}</span>
                    <span
                      class="meta"
                      :class="node.level === 2 && 'label2'"
                    >{{ data.tableComment || data.columnComment }}</span>
                    <span v-if="node.level === 1">
                      <a @click="onSelect(data)"> 选择 </a>
                    </span>
                  </span>
                </template>
              </ElTree>
            </ElCard>
          </ElCol>
          <ElCol :span="12">
            <ElCard
              class="cardh"
              shadow="never"
            >
              <FormList
                :table-schema="saveForm.tableSchema"
                :table-name="saveForm.tableName"
                :biz-name="saveForm.bizName"
                :is-create="false"
                type="edit"
              />
            </ElCard>
          </ElCol>
        </ElRow>
      </div>
    </template>
    <template v-else>
      <ElCard
        shadow="always"
        style="width:500px;margin:3% auto 0;padding:1% 3% 3%"
      >
        <h4>请输入数据库名：</h4>
        <ElRow justify="center">
          <ElCol>
            <ElForm>
              <ElFormItem label="数据库">
                <ElInput
                  v-model="saveForm.tableSchema"
                  placeholder="请输入数据库名"
                />
              </ElFormItem>
            </ElForm>
          </ElCol>
        </ElRow>
        <ElRow justify="center">
          <ElCol style="text-align: center">
            <ElButton
              type="primary"
              @click="onGetTableSchema"
            >
              查询
            </ElButton>
          </ElCol>
        </ElRow>
      </ElCard>
    </template>

    <!-- 生成 -->
    <AddDailog
      v-model:visible="isShowDialog"
      :table-schema="saveForm.tableSchema"
    />
  </main>
</template>

<script lang="ts">
// 代码生成
import {
  defineComponent, ref, reactive, watch,
} from 'vue';

import {
  ElRow, ElCol, ElButton, ElDivider, ElTree, ElMessage, ElInput, ElFormItem, ElForm, ElCard,
} from 'element-plus';

// import { ResResult } from './data.d';
import { getTableListBySchema, getColumnsByTableName } from './service';

import FormList from './component/formList.vue';

import AddDailog from './component/addDailog.vue';

import useTableList from './useTabelList';

export default defineComponent({
  name: 'CodeGeneration',
  components: {
    ElRow,
    ElCol,
    ElButton,
    ElTree,
    ElInput,
    ElFormItem,
    ElForm,
    ElCard,
    ElDivider,
    FormList,
    AddDailog,
  },
  setup() {
    const searchModel = reactive({
      tableSchema: '',
      tableName: '',
    });

    const isShowDialog = ref(false);

    const saveForm = reactive({
      tableSchema: 'platform',
      tableName: '',
      bizName: '',
      moduleName: '',
      rootPackage: '',
      searchStr: '',
      tabPrefix: '',
      isCreate: false,
    });

    const defaultProps = reactive({
      children: 'children',
      label: 'label',
      isLeaf: 'leaf',
    });

    const tableData = useTableList();
    const TreeRef = ref();

    watch(
      () => searchModel.tableName,
      (val) => {
        console.log(val);
        TreeRef.value.filter(val);
      },
    );

    const currentTreeKey = ref(['act_ge_property', 'act_re_deployment']);

    const onGetTableSchema = async () => {
      try {
        const {
          data: { success, message, obj },
        } = await getTableListBySchema(saveForm.tableSchema);
        if (success) {
          if (obj && obj.length) {
            tableData.value = obj.map((it) => ({ ...it, children: [], label: it.tableName }));
          } else {
            ElMessage.error('找不到相关数据');
          }
        } else {
          ElMessage.error(message);
        }
      } catch (e) {
        console.error('error', e);
      }
    };

    const onNew = () => {
      isShowDialog.value = true;
    };

    const getColumnsByTableNam = async () => {
      try {
        const {
          data: { success, message, obj },
        } = await getColumnsByTableName({
          tableSchema: saveForm.tableSchema,
          tableName: saveForm.tableName,
        });
        if (success) {
          if (obj) {
            console.log(obj);
            // tableData.value = obj.map((it) => ({ ...it, children: [] }));
          } else {
            ElMessage.error('找不到相关数据');
          }
        } else {
          ElMessage.error(message);
        }
      } catch (e) {
        console.error('error', e);
      }
    };

    const onReset = () => {
      tableData.value = [];
    };
    const onSelect = (data) => {
      console.log(data.tableName);
      saveForm.tableName = data.tableName;
      saveForm.bizName = data.tableComment || '';
    };

    const loadNode = async (node, resolve) => {
      if (node.level === 0) {
        resolve(tableData.value);
      } else if (node.level === 1) {
        const { tableName, tableSchema } = node.data;
        const {
          data: { success, obj },
        } = await getColumnsByTableName({ tableSchema, tableName });
        if (success) {
          const d = obj.map((it) => ({ ...it, label: it.columnName, leaf: true }));
          resolve(d);
        }
      }
      if (node.level > 1) {
        resolve([]);
      }
    };

    const filterNode = (value, data) => {
      if (!value) return true;
      return data.tableName.indexOf(value) !== -1;
    };

    return {
      tableData,
      searchModel,
      defaultProps,
      saveForm,
      isShowDialog,

      TreeRef,
      currentTreeKey,

      // function
      onNew,
      loadNode,
      onReset,
      filterNode,
      onGetTableSchema,
      getColumnsByTableNam,
      onSelect,
    };
  },
});
</script>

<style lang="scss" scoped>
.main {
  &__header {
    margin-bottom: 16px;

    &-buttons {
      text-align: right;
    }
  }
}

.tree {
  height: 50vh;
  overflow: hidden;
  overflow-y: auto;
}

.cardh {
  height: 63vh;
  overflow: hidden;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
  .label {
    width: 60%;
    &.label2 {
      font-size: 12px;
      color: #888;
    }
  }
  a {
    font-size: 12px;
    width: 4em;
    text-align: center;
    display: block;
  }
  .meta {
    font-size: 12px;
    white-space: nowrap;
    color: #666;
    text-align: left;
    flex: 1;
    &.label2 {
      color: #888;
    }
  }
}
</style>
