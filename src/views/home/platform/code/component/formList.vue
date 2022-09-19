<template>
  <ElForm
    ref="ruleForm"
    :inline="type === 'add'"
    label-width="6em"
    :model="saveForm"
    status-icon
    :rules="rules"
  >
    <ElFormItem
      label="数据库"
      prop="tableSchema"
      :style="type === 'add' && `width: 40%`"
    >
      <ElInput
        v-model="saveForm.tableSchema"
        disabled
      />
    </ElFormItem>
    <ElFormItem
      label="表名"
      prop="tableName"
      :style="type === 'add' && `width: 40%`"
      :class="{ animate__tada: showAnimate }"
    >
      <ElInput
        v-model="saveForm.tableName"
        :disabled="type === 'edit'"
      />
    </ElFormItem>
    <ElFormItem
      label="业务名"
      prop="bizName"
      :style="type === 'add' && `width: 40%`"
    >
      <ElInput v-model="saveForm.bizName" />
    </ElFormItem>
    <ElFormItem
      label="模块名称"
      prop="moduleName"
      :style="type === 'add' && `width: 40%`"
    >
      <ElInput v-model="saveForm.moduleName" />
    </ElFormItem>
    <ElFormItem
      label="项目包名"
      :style="type === 'add' && `width: 40%`"
      prop="rootPackage"
    >
      <ElInput v-model="saveForm.rootPackage" />
    </ElFormItem>
    <ElFormItem
      label="搜索字段"
      :style="type === 'add' && `width: 40%`"
      prop="searchStr"
    >
      <ElInput v-model="saveForm.searchStr" />
    </ElFormItem>
    <ElFormItem
      label="表前缀"
      :style="type === 'add' && `width: 40%`"
      prop="tabPrefix"
    >
      <ElInput v-model="saveForm.tabPrefix" />
    </ElFormItem>
    <ElFormItem
      v-if="type === 'edit'"
      label="创建新表"
    >
      <ElRadioGroup
        v-model="saveForm.isCreate"
        :disabled="isCreate === false"
      >
        <ElRadio
          :label="true"
          name="isCreate"
        >
          是
        </ElRadio>
        <ElRadio
          :label="false"
          name="isCreate"
        >
          否
        </ElRadio>
      </ElRadioGroup>
    </ElFormItem>
    <ElFormItem
      v-else
      label="创建新表"
      :style="type === 'add' && `width: 40%`"
    >
      <ElRadioGroup
        v-model="saveForm.isCreate"
        disabled
      >
        <ElRadio
          :label="true"
          name="isCreate"
        >
          是
        </ElRadio>
        <ElRadio
          :label="false"
          name="isCreate"
        >
          否
        </ElRadio>
        <ElButton @click="onCreatd">
          +字段
        </ElButton>
      </ElRadioGroup>
    </ElFormItem>
    <ElFormItem
      v-if="saveForm.colList && saveForm.colList[0] && saveForm.colList[0].columnName"
      label="新字段"
      style="width: 100%"
    >
      <ElTag
        v-for="it in saveForm.colList"
        :key="it.id"
        class="tags"
      >
        {{ it.columnName }}
      </ElTag>
    </ElFormItem>

    <ElFormItem
      label=""
      label-width="0"
      style="width: 100%"
    >
      <div class="creat-btn">
        <ElButton
          type="primary"
          @click="onConfirm"
        >
          生成代码
        </ElButton>
      </div>
    </ElFormItem>
  </ElForm>
  <ElDialog
    v-model="isShowModal"
    title="新建字段"
    :close-on-click-modal="false"
    destroy-on-close
  >
    <Item
      v-for="(it, idx) in colListS"
      :key="it.id"
      :index="idx"
      :data="it"
      @del="onDelItem"
      @change="onChangeItem"
    />
    <div style="padding-left: 2em">
      <ElButton
        icon="el-icon-plus"
        @click="onAddItem"
      >
        新增
      </ElButton>
    </div>
    <div class="btns">
      <div class="btns0" />
      <div class="btns1">
        <ElButton
          icon="el-icon-refresh-left"
          @click="onClean"
        >
          清空
        </ElButton>
        <ElButton
          icon="el-icon-finished"
          type="primary"
          @click="onClose"
        >
          完成
        </ElButton>
      </div>
    </div>
  </ElDialog>
</template>
<script lang="ts">
import {
  defineComponent, PropType, toRefs, ref, onMounted, watch, reactive,
} from 'vue';
import {
  ElButton, ElInput, ElFormItem, ElForm, ElRadio, ElRadioGroup, ElMessage, ElDialog, ElTag,
} from 'element-plus';

import { cloneDeep } from 'lodash-es';
import { ReqParams } from '../data.d';
import { doCodeGenerator } from '../service';
import useTableList from '../useTabelList';
import Item from './item.vue';

interface ComponentProps {
  isCreate: boolean;
  tableSchema: string;
  tableName: string;
  bizName: string;
  type: 'add' | 'edit';
}

export default defineComponent({
  name: 'AddTabel',
  components: {
    ElButton,
    ElInput,
    ElTag,
    ElFormItem,
    ElForm,
    ElRadio,
    ElRadioGroup,
    ElDialog,
    Item,
  },
  props: {
    isCreate: {
      type: Boolean as PropType<ComponentProps['isCreate']>,
      default: false,
    },

    tableSchema: {
      type: String as PropType<ComponentProps['tableSchema']>,
      default: '',
    },

    bizName: {
      type: String as PropType<ComponentProps['bizName']>,
      default: '',
    },

    tableName: {
      type: String as PropType<ComponentProps['tableName']>,
      default: '',
    },

    type: {
      type: String as PropType<ComponentProps['type']>,
      default: () => 'add',
    },
  },

  setup(props: ComponentProps) {
    const isShowModal = ref(false);
    const {
      tableSchema, tableName, isCreate, type,
    } = toRefs(props);
    const ruleForm = ref();
    const showAnimate = ref(false);
    const showAnimateTime = ref();

    const tableData = useTableList();
    const colListS = ref<ReqParams.ColList[]>([]);
    const saveForm: ReqParams.Save = reactive({
      tableSchema: '',
      tabeSchema: '',
      tableName: '',
      bizName: '',
      moduleName: '',
      rootPackage: '',
      searchStr: '',
      tabPrefix: '',
      colList: colListS,
      isCreate: false,
    });
    const colListDef: ReqParams.ColList = {
      columnComment: '',
      columnName: '',
      dataType: '1',
      isSearch: false,
      length: '10',
      id: '',
    };

    const onCreatd = () => {
      isShowModal.value = true;
    };

    const onClose = () => {
      isShowModal.value = false;
    };

    const onClean = () => {
      colListS.value = [cloneDeep(colListDef)];
    };

    if (type.value === 'edit') {
      watch(
        () => saveForm.tableName,
        () => {
          showAnimate.value = true;
          clearTimeout(showAnimateTime.value);
          showAnimateTime.value = setTimeout(() => {
            showAnimate.value = false;
          }, 900);
        },
      );
      watch(
        () => [props.tableName, props.bizName, props.tableSchema],
        (n) => {
          console.log('watch', n);
          saveForm.tableName = n[0];
          saveForm.bizName = n[1];
          saveForm.tableSchema = n[2];
          saveForm.tabeSchema = n[2];
        },
      );
      // watch(
      //   () => props.tableSchema,
      //   (n) => {
      //     console.log('watch', n);
      //     saveForm.tableSchema = n;
      //     saveForm.tabeSchema = n; // 保存用
      //   },
      // );
    }

    const onAddItem = () => {
      const tem = cloneDeep(colListDef);
      tem.id = `item_${colListS.value.length}`;
      colListS.value.push(tem);
    };

    const onDelItem = (index) => {
      const tem = cloneDeep(colListS.value);
      tem.splice(index, 1);
      colListS.value = tem;
    };

    const onChangeItem = (data, index) => {
      const tem = cloneDeep(colListS.value);
      tem.splice(index, 1, data);
      colListS.value = tem;
      console.log(colListS.value);
    };

    onMounted(() => {
      saveForm.tableSchema = tableSchema.value;
      saveForm.tabeSchema = tableSchema.value; // 保存用
      saveForm.tableName = tableName.value;
      saveForm.isCreate = isCreate.value;
      if (type.value === 'add') {
        onAddItem();
      }
    });

    const checkNull = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('不能为空'));
      }
      if (!/^[a-zA-Z]/.test(value) && rule.field !== 'bizName') {
        return callback(new Error('只能使用字母开头'));
      }
      return true;
    };

    const downloadFile = (buffer, fileName) => {
      const blob = new Blob([buffer], { type: 'application/zip' });
      // FileReader主要用于将文件内容读入内存
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      // onload当读取操作成功完成时调用
      reader.onload = (event) => {
        console.log('downloadFile', event);
        const a = document.createElement('a');
        a.download = fileName;
        if (typeof event.target?.result === 'string') {
          a.href = event.target.result;
        }
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      };
    };

    const save = async () => {
      try {
        const data = await doCodeGenerator(saveForm);
        if (data.data) {
          let str = data.headers['content-disposition'].split('=');
          str = str[str.length - 1];
          const fileName = str;
          downloadFile(data.data, fileName);
        }
      } catch (e) {
        console.log('error', e);
        ElMessage.error(e.message);
      }
    };

    const onConfirm = () => {
      ruleForm.value.validate(async (isValid: boolean) => {
        if (isValid) {
          // 新建字段
          if (saveForm.isCreate) {
            let isOkByItem = true;
            if (!saveForm.colList) {
              isOkByItem = false;
              return;
            }
            const line = [0, ''];
            for (let i = 0; i < saveForm.colList.length; i += 1) {
              const it = saveForm.colList[i];
              line[0] = i + 1;
              if (!it) {
                isOkByItem = false;
                line[1] = 'row';
                break;
              }
              if (!it.columnName || !/^[a-zA-Z]/.test(it.columnName)) {
                isOkByItem = false;
                line[1] = '字段名';
                break;
              }
              if (!it.dataType) {
                isOkByItem = false;
                line[1] = '字段类型';
                break;
              }
              if (!it.length || !/^\d+$/.test(it.length)) {
                isOkByItem = false;
                line[1] = '字段长度';
                break;
              }
            }
            if (isOkByItem) {
              save();
            } else {
              ElMessage.error(`必须配置字段信息，请检查 ${line[0]} 行,“${line[1]}”字段`);
            }
          } else {
            save();
          }
        }
      });
    };

    return {
      saveForm,
      showAnimate,
      showAnimateTime,
      ruleForm,
      tableData,
      colListS,
      isShowModal,
      rules: {
        bizName: [{ validator: checkNull, trigger: 'change' }],
        tabeSchema: [{ validator: checkNull, trigger: 'change' }],
        tableName: [{ validator: checkNull, trigger: 'change' }],
        rootPackage: [{ validator: checkNull, trigger: 'change' }],
        moduleName: [{ validator: checkNull, trigger: 'change' }],
        colList: [{ validator: checkNull, trigger: 'change' }],
        isCreate: [{ validator: checkNull, trigger: 'change' }],
      },

      onConfirm,
      onChangeItem,
      onDelItem,
      onAddItem,
      onCreatd,
      downloadFile,
      onClean,
      onClose,
    };
  },
});
</script>

<style lang="scss" scoped>
@keyframes tada {
  0%,
  11.1%,
  to {
    transform: translateZ(0);
  }

  22.2% {
    transform: skewX(-12.5deg) skewY(-12.5deg);
  }

  33.3% {
    transform: skewX(6.25deg) skewY(6.25deg);
  }

  44.4% {
    transform: skewX(-3.125deg) skewY(-3.125deg);
  }

  55.5% {
    transform: skewX(1.5625deg) skewY(1.5625deg);
  }

  66.6% {
    transform: skewX(-0.78125deg) skewY(-0.78125deg);
  }

  77.7% {
    transform: skewX(0.390625deg) skewY(0.390625deg);
  }

  88.8% {
    transform: skewX(-0.1953125deg) skewY(-0.1953125deg);
  }
}

.animate__tada {
  animation: tada ease 1s backwards;
}
.creat-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
  flex-direction: column;
}
.btns {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 40px;
}
.bnts0 {
  margin-left: 2em;
}
.btns1 {
  margin-right: 1em;
}
.tags {
  margin: 0 5px 5px 0;
}
</style>
