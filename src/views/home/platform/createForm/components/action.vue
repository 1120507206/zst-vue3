<template>
  <ElDialog
    v-model="isShowModal"
    custom-class="dialog__create-form"
    append-to-body
    :title="type === 'add' ? '新增' : '编辑'"
    fullscreen
  >
    <div class="action">
      <ElRow class="db__base-info">
        <ElCol :span="24">
          <ElForm
            :model="baseInfo"
            inline
            :label-width="100"
          >
            <ElFormItem
              label="表名"
              prop="tableName"
              required
            >
              <ElInput v-model="baseInfo.tableName" />
            </ElFormItem>
            <ElFormItem
              label="表描述"
              prop="tableDesc"
              required
            >
              <ElInput v-model="baseInfo.tableDesc" />
            </ElFormItem>
          </ElForm>
        </ElCol>
      </ElRow>
      <ElTabs
        v-model="activeName"
        class="db__detail-info"
      >
        <ElTabPane
          v-for="item in pageConfig"
          :key="item.value"
          :label="item.label"
          :name="item.value"
        />
      </ElTabs>
      <keep-alive>
        <component
          :is="currentComponent"
          :data="configData"
        />
      </keep-alive>
    </div>
    <template #footer>
      <ElButton @click="onCancel">
        关闭
      </ElButton>
      <ElButton
        type="primary"
        @click="onSubmit"
      >
        保存
      </ElButton>
    </template>
  </ElDialog>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  computed,
  watch,
  toRefs,
  PropType,
} from 'vue';
import {
  ElDialog,
  ElRow,
  ElCol,
  ElForm,
  ElFormItem,
  ElInput,
  ElTabs,
  ElTabPane,
  ElButton,
  ElMessage,
} from 'element-plus';
import { useVModel } from '@vueuse/core';
import DBProp from './dbProp.vue';
import PageProp from './pageProp.vue';
import CheckField from './checkField.vue';
import ForeignKey from './foreignKey.vue';
import Indexes from './indexes.vue';
import SearchConfig from './searchConfig.vue';
import { ReqParams } from '../data.d';
import { get, save } from '../service';

interface ComponentProps {
  visible: boolean,
  type: 'add' | 'edit',
  id: string,
}

export default defineComponent({
  components: {
    ElDialog,
    ElRow,
    ElCol,
    ElForm,
    ElFormItem,
    ElInput,
    ElTabs,
    ElTabPane,
    ElButton,

    DBProp,
    PageProp,
    CheckField,
    ForeignKey,
    Indexes,
    SearchConfig,
  },

  props: {
    visible: {
      type: Boolean as PropType<ComponentProps['visible']>,
      default: true,
    },

    type: {
      type: String as PropType<ComponentProps['type']>,
      default: 'add',
    },

    id: {
      type: String as PropType<ComponentProps['id']>,
      default: '',
    },
  },

  emits: ['update:visible'],

  setup(props: ComponentProps) {
    const isShowModal = useVModel(props, 'visible');
    const { type, id } = toRefs(props);

    const baseInfo = reactive({
      tableName: '',
      tableDesc: '',
    });

    const pageConfig = [
      {
        label: '数据库属性',
        value: 'db_prop',
      },
      {
        label: '页面属性',
        value: 'page_prop',
      },
      {
        label: '校验字段',
        value: 'check_field',
      },
      {
        label: '外键',
        value: 'foreign_key',
      },
      {
        label: '索引',
        value: 'indexes',
      },
      {
        label: '查询配置',
        value: 'search_config',
      },
    ];
    const activeName = ref('page_prop');

    const configData = ref<ReqParams.ColumnsDTO>([
      {
        columnName: 'ID',
        columnComment: '主键',
        dataType: 1,
        length: '32',
        isSearch: false,
        listDisplay: false,
        disabled: true,
      },
      {
        columnName: 'CREATE_BY',
        columnComment: '创建人',
        dataType: 1,
        length: '32',
        isSearch: false,
        listDisplay: false,
        disabled: true,
      },
      {
        columnName: 'CREATE_TIME',
        columnComment: '创建日期',
        dataType: 3,
        length: '0',
        isSearch: false,
        listDisplay: false,
        disabled: true,
      },
      {
        columnName: 'UPDATE_BY',
        columnComment: '更新人',
        dataType: 1,
        length: '32',
        isSearch: false,
        listDisplay: false,
        disabled: true,
      },
      {
        columnName: 'UPDATE_TIME',
        columnComment: '更新日期',
        dataType: 3,
        length: '0',
        isSearch: false,
        listDisplay: false,
        disabled: true,
      },
      {
        columnName: 'ORG_ID',
        columnComment: '所属部门',
        dataType: 1,
        length: '32',
        isSearch: false,
        listDisplay: false,
        disabled: true,
      },
    ]);

    //#region 获取数据
    const fetchData = async () => {
      try {
        const { data: { success, message, obj } } = await get(id.value);
        if (success) {
          console.log(obj);
        } else {
          ElMessage.error(message);
        }
      } catch (e) {
        console.error('error', e);
      }
    };

    watch(isShowModal, () => {
      if (isShowModal.value) {
        if (type.value === 'add') {
          Object.assign(baseInfo, {
            tableName: '',
            tableDesc: '',
          });
        } else {
          fetchData();
        }
      }
    });
    //#endregion

    //#region 动态组件
    const componentMap = new Map([
      ['db_prop', 'DBProp'],
      ['page_prop', 'PageProp'],
      ['check_field', 'CheckField'],
      ['foreign_key', 'ForeignKey'],
      ['indexes', 'Indexes'],
      ['search_config', 'SearchConfig'],
    ]);
    const currentComponent = computed(() => componentMap.get(activeName.value));
    //#endregion

    //#region events
    const onCancel = () => {
      isShowModal.value = false;
    };

    const onSubmit = async () => {
      try {
        const data: ReqParams.DTO = {
          columnsDTO: [],
          formJson: '',
          seachJson: '',
          tableDesc: baseInfo.tableDesc,
          tableJson: '',
          tableName: baseInfo.tableName,
        };
        data.columnsDTO = configData.value;
        const seachJson = configData.value.filter((item) => item.isSearch);
        data.seachJson = JSON.stringify(seachJson);
        data.tableJson = JSON.stringify(configData.value);

        console.log(data);
        const { data: { success, message } } = await save({
          ...data,
          id: data.id || '',
        });
        if (success) {
          ElMessage.success('保存成功');
          onCancel();
        } else {
          ElMessage.error(message);
        }
      } catch (e) {
        console.error('error', e);
      }
    };
    //#endregion

    return {
      isShowModal,

      baseInfo,

      pageConfig,
      activeName,

      configData,

      // 动态组件
      currentComponent,

      //#region events
      onSubmit,
      onCancel,
      //#endregion
    };
  },
});
</script>

<style lang="scss" scoped>
.action {
  height: 100%;
  .db__base-info {
    .el-form-item {
      width: 33.33%;
    }
  }
}
</style>
