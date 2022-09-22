<template>
  <div>
    <el-row justify="center">
      <el-col :span="10">
        <span> 选择有效期：</span>
        <el-select
          v-model="validityperiod"
          @change="validityChange"
          style="width: 280px;"
          placeholder="Select"
          size="large"
        >
          <el-option
            v-for="item in validityperiodList"
            :key="item.id"
            :label="item.timePeriod"
            :value="item.id"
          />
        </el-select>
      </el-col>
    </el-row>
    <el-divider />

    <el-form
      ref="elForm"
      :model="formData"
      size="medium"
      label-width="100px"
      label-position="left"
    >
      <div class="form-title">项目数限制</div>
      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item label="额定项目数" prop="labelValue2">
            <el-input
              v-model="formData.labelValue2"
              placeholder="请输入整数"
              clearable
              onkeyup="value=value.replace(/[^0-9]/g, '')"
              :disabled="radioProject"
              :style="{ width: '80%' }"
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="超额项目数" prop="labelValue3">
            <el-input
              v-model="formData.labelValue3"
              placeholder="请输入整数"
              :disabled="radioProject"
              onkeyup="value=value.replace(/[^0-9]/g, '')"
              clearable
              :style="{ width: '80%' }"
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-checkbox v-model="radioProject" label="不限" size="large" />
          </el-form-item>
        </el-col>
      </el-row>
      <div class="form-title">接口并发数</div>
      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item label="数量" prop="labelValue1">
            <el-input
              v-model="formData.labelValue1"
              placeholder="请输入整数"
              onkeyup="value=value.replace(/[^0-9]/g, '')"
              clearable
              :style="{ width: '80%' }"
            >
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="form-title">设置接口调用限制</div>

      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item label="额定调用数" prop="labelValue4">
            <el-input
              v-model="formData.labelValue4"
              placeholder="请输入整数"
              onkeyup="value=value.replace(/[^0-9]/g, '')"
              clearable
              :disabled="radioNum"
              :style="{ width: '80%' }"
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="超额调用次数" prop="labelValue5">
            <el-input
              v-model="formData.labelValue5"
              placeholder="请输入整数"
              clearable
              :disabled="radioNum"
              :style="{ width: '80%' }"
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="">
            <el-checkbox v-model="radioNum" label="不限" size="large" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row justify="center">
        <el-col :span="4">
          <el-button type="primary" @click="submitForm">确定</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
  import { ElMessage } from "element-plus";
  import { reactive, ref, watch, onMounted, toRefs } from "vue";
  import {
    getValidDateList,
    saveUserIdentity,
    getUserIdentity,
  } from "../service";
  const props = defineProps({
    id: { type: String, default: "" },
  });

  //查询单个标签
  const getSingeleIdentity = async (id: any) => {
    const params = {
      id: id,
    };
    const {
      data: { success, message, obj },
    } = await getUserIdentity(params);
    console.log("单个", obj);
    if (!obj) {
      validityperiodList.value = [];
      validityperiod.value = "";
      formData.labelValue1 = 0;
      formData.labelValue2 = 0;
      formData.labelValue3 = 0;
      formData.labelValue4 = 0;
      formData.labelValue5 = 0;
      return;
    }
    formDataDeal(id);
  };
  //查询列表条件
  const getPageData = async (id: string) => {
    const params = {
      userId: id,
    };
    console.log("params", params);
    const {
      data: { success, message, obj },
    } = await getValidDateList(params);

    if (obj.length == 0) {
    validityperiodList.value = []
     validityperiod.value = ''
       formData.labelValue1 = 0;
      formData.labelValue2 = 0;
      formData.labelValue3 = 0;
      formData.labelValue4 = 0;
      formData.labelValue5 = 0;
      return;
    }
    validityperiodList.value = obj.map((item: any) => {
      item.timePeriod = item.validDateFrom + "至" + item.validDateEnd;
      return item;
    });
    getSingeleIdentity(obj[0].id);
    validityperiod.value = obj[0].id ? obj[0].id : "";
  };
  onMounted(() => {
    getPageData(props.id);
  }),
    //监听函数
    watch(
      () => props.id,
      (val, old) => {
        getPageData(val);
      }
    );

  //有效期下拉框
  const validityperiodList = ref<any>([]);
  const validityperiod = ref(""); //有效期当前值
  //下拉菜单方法
  const validityChange = (id: any) => {
    formDataDeal(id);
  };

  // 表单数据的一些处理
  const formDataDeal = async (id: string) => {
    const params = {
      id: id,
    };
    const {
      data: { success, message, obj },
    } = await getUserIdentity(params);
    const selsetObj = obj;
    const selectArr: any = validityperiodList.value.filter(
      (item: any) => item.id == id
    );
    formData.id = id;
    formData.labelValue1 = selsetObj.labelValue1;
    formData.labelValue2 = selsetObj.labelValue2;
    formData.labelValue3 = selsetObj.labelValue3;
    formData.labelValue4 = selsetObj.labelValue4;
    formData.labelValue5 = selsetObj.labelValue5;
    formData.validDateFrom = selsetObj.validDateFrom;
    formData.validDateEnd = selsetObj.validDateEnd;

    if (formData.labelValue2 === -1 && formData.labelValue3 == -1) {
      radioProject.value = true;
      formData.labelValue2 = null;
      formData.labelValue3 = null;
    } else {
      radioProject.value = false;
    }
    if (formData.labelValue4 === -1 && formData.labelValue5 == -1) {
      radioNum.value = true;
      formData.labelValue4 = null;
      formData.labelValue5 = null;
    } else {
      radioNum.value = false;
    }
  };
  interface FormData {
    id?: string;
    userId: any;
    validDateFrom:string;
    validDateEnd:string;
    labelValue1: any; //并发数量
    labelValue2: any; //额定项目数
    labelValue3: any; //超额项目数
    labelValue4: any; //额定调用次数
    labelValue5: any; //超额调用次数
  }
  //表单
  const formData: FormData = reactive({
    id: "",
    userId: props.id,
        validDateFrom:'',
    validDateEnd:'',
    labelValue1: 0, //并发数量
    labelValue2: 0, //额定项目数
    labelValue3: 0, //超额项目数
    labelValue4: 0, //额定调用次数
    labelValue5: 0, //超额调用次数
  });
  const radioProject = ref(false); //项目不限
  const radioNum = ref(false); //数量不限
  //表单提交
  const submitForm = async () => {
    const ischeck = formDataCheck();
    if (!ischeck) {
      ElMessage.error("请输入必填项!");
      return;
    }
    const params = { ...formData };
    if (radioProject.value) {
      params.labelValue2 = -1;
      params.labelValue3 = -1;
    }
    if (radioNum.value) {
      params.labelValue4 = -1;
      params.labelValue5 = -1;
    }
    const {
      data: { success, message, obj },
    } = await saveUserIdentity(params);
    if (success) {
      ElMessage.success("修改成功！");
    } else {
      ElMessage.error(message);
    }
    getSingeleIdentity(params.id);
    console.log("params", params);
  };
  //表单检验方法
  const formDataCheck = () => {
    const {
      labelValue1,
      labelValue2,
      labelValue3,
      labelValue4,
      labelValue5,
    } = formData;
    if ((!labelValue2 || !labelValue3) && !radioProject.value) {
      return false;
    }
    if ((!labelValue4 || !labelValue5) && !radioNum.value) {
      return false;
    }
    if (!labelValue1) {
      return false;
    }
    return true;
  };
</script>

<style lang="scss" scoped>
  .form-title {
    margin-bottom: 20px;
  }
</style>
