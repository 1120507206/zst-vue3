<template>
  <div>
    <el-row justify="center">
      <el-col :span="8">
        <span> 选择有效期：</span>
        <el-select
          v-model="validityperiod"
          class="m-2"
          placeholder="Select"
          size="large"
        >
          <el-option
            v-for="item in validityperiodList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-col>
    </el-row>
    <el-divider />

    <el-form
      ref="elForm"
      :model="formData"
      :rules="rules"
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
              type="number"
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
              type="number"
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
              type="number"
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
              type="number"
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
              @input="handleEdit"
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
  import { reactive, ref } from "vue";

  //有效期下拉框
  const validityperiodList = ref([
    { value: "1", label: "2022-2023" },
    { value: "2", label: "2055-2066" },
  ]);
  const validityperiod = ref("");

  //表单
  const formData = reactive({
    labelValue1: 5, //并发数量
    labelValue2: 5, //额定项目数
    labelValue3: 5, //超额项目数
    labelValue4: 5, //额定调用次数
    labelValue5: 5, //超额调用次数
  });
  const radioProject = ref(false); //项目不限
  const radioNum = ref(false); //数量不限
  //表单提交
  const submitForm = () => {
    const ischeck = formDataCheck();
    if (!ischeck) {
      ElMessage.error("请输入必填项!");
      return;
    }
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
