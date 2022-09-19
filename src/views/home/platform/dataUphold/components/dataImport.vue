<template>
  <div style="margin-top: 20px;">
    <el-row>
      <el-col :span="12">
        <div>自动导入 <el-switch v-model="isAutoUpload" /></div>
        <div class="tip" style="margin-bottom: 16px;">
          (开启后，上传文件自动入库；关闭后，需要手动点击表格导入按钮入库)
        </div>
        <a :href="modelUrl" class="loadown">下载模板</a>
        <div class="tip">支持.xlsx文件上传</div>
      </el-col>
      <el-col :span="6">
        <el-form :model="formData" :rules="rules" label-width="120px">
          <el-form-item label="选择报表" prop="tableName">
            <el-select
              v-model="formData.tableName"
              clearable
              placeholder="请选择"
              style="width: 250px"
            >
              <el-option
                v-for="(item, index) in tableNameOptions"
                :key="index"
                :value="index == 5 ? 6 : index"
                :label="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="导入原因" prop="reason">
            <el-input
              style="width:250px"
              v-model="formData.reason"
              maxlength="200"
              show-word-limit
              type="textarea"
              placeholder="请输入导入原因"
            />
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="6">
        <el-upload
          v-model:file-list="fileList"
          class="upload-demo"
          action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
          multiple
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :limit="3"
          :on-exceed="handleExceed"
        >
          <el-button type="primary"> 上传文件</el-button>
        </el-upload>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div>我的上传记录</div>
        <el-table :data="tableData"   style="width: 100%">
        <template #empty>
        <div>暂未选择导入</div>
        </template>
          <el-table-column prop="index" label="序号" width="80" />
          <el-table-column prop="tableName" label="数据表"  />
          <el-table-column prop="fileName" label="文件名" width="200" />
          <el-table-column prop="count" label="数据量"  />
          <el-table-column prop="reason" label="导入原因" width="200" />
          <el-table-column prop="importTime" label="上传时间" width="180" />
          <el-table-column prop="gmtUpdated" label="更新时间" width="180" />
          <el-table-column prop="status" label="状态" width="120" />
         <el-table-column label="操作">
          <template #default="scope">
        <el-button size="small" @click="handleEdit(scope.$index, scope.row)"
          >Edit</el-button
        >
        <el-button
          size="small"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)"
          >Delete</el-button
        >
      </template>
         </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
  export default {
    data() {
      return {
        modelUrl: "", //地址
        isAutoUpload: false, // 自动导入开关的值
        formData: {
          // 表单数据
          tableName: undefined,
          reason: "",
        },
        rules: {
          // 表单校验
          tableName: [
            {
              type: "number",
              required: true,
              message: "请选择报表",
              trigger: "change",
            },
          ],
          reason: [
            { required: true, message: "请输入导入原因", trigger: "blur" },
          ],
        },
         tableData: [], // 表格数据
        tableNameOptions: [
          // 数据表下拉框选项
          "行政区映射表",
          "开发商映射表",
          "物业类型映射表",
          "户型映射表",
          "房屋状态映射表",
          "楼盘名称映射表",
        ],
      };
    },
    created() {},
    mounted() {},
    methods: {},
  };
</script>

<style scoped lang="scss">
  .tip {
    color: #999;
    font-size: 12px;
  }
  .table-title {
    color: #333333;
    padding: 13px 0 20px;
  }
</style>
