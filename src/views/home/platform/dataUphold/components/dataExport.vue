<template>
  <div class="data-import-container">
    <a-card class="top-wrap">
      <!-- 表单 -->
      <Form
        class="custom-form"
        inline
        label-position="left"
        :rules="rules"
        :model="formData"
        :label-width="150"
      >
        <el-form-item label="省份" prop="provinceCodeList">
          <el-select
            v-model="formData.provinceCodeList"
            multiple
            filterable
            :max-tag-count="2"
            placeholder="请选择"
            label-in-value
            @on-change="onProvinceChange"
          >
            <el-option
              v-for="item in provinceOptions"
              :key="item.provinceCode"
              :value="item.provinceCode"
              >{{ item.provinceName }}</el-option
            >
          </el-select>
        </el-form-item>
        <el-form-item label="城市" prop="cityNameCodeList">
          <el-select
            v-model="formData.cityNameCodeList"
            multiple
            filterable
            :max-tag-count="2"
            placeholder="请选择"
            label-in-value
            @on-change="onCityChange"
          >
            <el-option
              v-for="(item, index) in cityOptions"
              :key="item.cityCode + index"
              :value="item.cityCode"
              >{{ item.cityName }}</el-option
            >
          </el-select>
        </el-form-item>
        <el-form-item label="采集时间" prop="crawlTime">
          <div slot="label">
            <el-tooltip placement="bottom" theme="light" max-width="344">
              <Icon
                type="ios-alert-outline"
                style="font-size: 12px;color: #999;"
              />
              <template #content>
                <div
                  style="font-size: 12px;white-space: normal;line-height: 24px;"
                >
                  “行政区映射表”无采集时间字段，因此选择该表导出时，采集时间不生效，下方默认显示“--”
                </div>
              </template>
            </el-tooltip>
            <span>采集时间</span>
          </div>
          <el-date-picker
            type="daterange"
            v-model="formData.crawlTime"
            placement="bottom-start"
            placeholder="请选择时间范围"
          ></el-date-picker>
        </el-form-item>
        <el-form-item
          label="数据表"
          prop="tableNameList"
          class="ivu-form-item-required"
        >
          <el-select
            v-model="formData.tableNameList"
            multiple
            :max-tag-count="1"
            placeholder="请选择"
          >
            <el-option v-for="(item, index) in tableNameOptions" :value="index">{{
              item
            }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="监控字段值" prop="columnIsNull">
          <div slot="label" style="display: inline-block;">
            <el-tooltip placement="bottom" theme="light" max-width="344">
              <Icon
                type="ios-alert-outline"
                style="font-size: 12px;color: #999;"
              />
              <template #content>
                <div
                  style="font-size: 12px;white-space: normal;line-height: 24px;"
                >
                  <div>1、房屋状态映射表监控字段为：“审核房屋状态”</div>
                  <div>2、户型映射表监控字段为：“zst户型”</div>
                  <div>3、开发商映射表监控字段为：“开发商名称修正”</div>
                  <div>4、楼盘名称映射表监控字段为：“zst楼栋名称”</div>
                  <div>5、物业类型映射表监控字段为：“物业类型修正”</div>
                  <div>监控字段选择“null”时，则导出对应字段为null的数据。</div>
                </div>
              </template>
            </el-tooltip>
            <span>监控字段值</span>
          </div>
          <el-select v-model="formData.columnIsNull" placeholder="请选择">
            <el-option
              v-for="item in columnIsNullOptions"
              :key="item.value"
              :value="item.value"
              >{{ item.label }}</el-option
            >
          </el-select>
        </el-form-item>

        <el-form-item label="导出原因" prop="reason">
          <el-input
            v-model="formData.reason"
            maxlength="200"
            show-word-limit
            type="textarea"
            placeholder="请输入导出原因"
          />
        </el-form-item>
        <div class="form-btn">
          <Button
            type="primary"
            :loading="addloading"
            @click="handleSubmit('add')"
          >
            <span class="btn-content"
              >增加导出需求<img style="margin-left:5px;" alt=""
            /></span>
          </Button>
          <Button @click="handleSubmit('save')">保存模板</Button>
          <Button style="width: 60px;" @click="handleReset">重置</Button>
        </div>
      </Form>
      <!-- 我的模板 -->
      <!-- <div class="model-wrap">
        <div class="title">我的模板</div>
        <ul class="tags-wrap">
          <template v-if="modelList.length > 0">
            <li
              v-for="item in modelList"
              :key="item.id"
              @click="onTageClick(item)"
            >
              {{ item.moduleName }}
              <div @click.stop>
                <comfirm-tip
                  title="确定删除该模板？"
                  @on-ok="handleModelDel(item.id)"
                >
                  <Icon type="md-close" class="icon" />
                </comfirm-tip>
              </div>
            </li>
          </template>
          <div v-else class="no-model">暂无模板</div>
        </ul>
      </div> -->
    </a-card>

    <!-- 表格 -->
    <!-- <a-card class="table-wrap">
      <div class="batch-wrap">
        <div>已选择导出</div>
        <Button class="btn" type="primary" :loading="exportZipLoading" @click="onBatchExport"><span>批量导出<Icon style="margin-left: 6px;" type="ios-arrow-dropright" /></span></Button>
      </div>
      <table-page :columns="columns" :data="tableData" no-data-text="暂未选择导出">
        <template slot-scope="{ row, index }" slot="action">
          <Button :type="row.exported ? 'success' : 'primary'" style="margin-right: 10px;" size="small" :loading="row.loading" @click="onTableExport(index,row)">导出</Button>
          <comfirm-tip title="确定删除该数据？" @on-ok="onTableDel(index)">
            <Button type="error" size="small">删除</Button>
          </comfirm-tip>
        </template>
      </table-page>
    </a-card> -->

    <!-- <model-modal ref="modelModal" @save-success="onModelSaveSuccess"></model-modal> -->
  </div>

</template>

<script lang="ts" setup>
  import { reactive, ref } from "vue";
  import type { FormInstance, FormRules } from 'element-plus'
    const    formData =reactive({ // 表单数据
        provinceCodeList: [],
        provinceNameStr: '',
        cityNameCodeList: [],
        cityNameStr: '',
        crawlTime: ['',''],
        tableNameList: [],
        columnIsNull: 'true', // 默认展示 null,“null”：true“全量”：false
        reason: "",
      },)
    //表单验证
  const rules = reactive<FormRules>({
    tableNameList: [
          // { validator: validTableName, trigger: 'change' }
        ],
        columnIsNull: [
          { required: true, message: '请选择监控字段值', trigger: 'change' }
        ],
        reason: [
          { required: true, message: '请输入导出原因', trigger: 'blur' }
        ],
  })


    // 获取城市数据
  const  httpCityList = (provinceCodes:any)=> {
      // getCityList({provinceCodes}).then(res => {
      //   if(res.flag) {
      //     cityOptions = res.data;
      //   }
      // })
    }

    const  provinceOptions = ref([])// 省选项
      // 省份数据改变
  const  onProvinceChange=(values:any)=> {
      const labelList = values.map(item => item.label);
      formData.provinceNameStr = labelList.join('、');
      const codeList = values.map(item => item.value).join(',');
      httpCityList(codeList);
    }


</script>

<style lang="scss" scoped>
.data-import-container {
  color: #424242;
}
.top-wrap {
  display: flex;
  border-radius: 0 0 24px 24px;
}
.btn-content {
  display: flex;
  align-items: center;
}
// 表单
.custom-form {
  display: flex;
  flex-wrap: wrap;
  width: 864px;
  .form-btn {
    font-size: 0;
    .ivu-btn {
      height: 40px;
      background: #FFFFFF;
      border-radius: 4px 4px 4px 4px;
      border: 1px solid #E0E0E0;
      margin-right: 16px;
      &:first-of-type {
        background: #3399FF;
        border: 1px solid #3399FF;
      }
    }
  }
}
// 我的模板
.model-wrap {
  .title {
    line-height: 1;
    padding: 10px 12px 10px 0;
  }
  .tags-wrap {
    margin: 0;
    padding: 0;
    list-style-type: none;
    display: flex;
    flex-wrap: wrap;
    max-width: 548px;
    cursor: pointer;
    .no-model {
      color: #C2C2C2;
      padding-left: 10px;
    }
    li {
      font-size: 12px;
      // width: 147px;
      height: 22px;
      background: #FBFBFE;
      border-radius: 2px 2px 2px 2px;
      border: 1px solid #F0F1F3;
      padding: 1px 5px 1px 5px;
      margin-right: 4px;
      margin-bottom: 4px;
      white-space: nowrap;
      display: flex;
      align-items: center;
      // &:nth-of-type(2n) {
      //   margin-right: 0;
      // }
      // &:nth-last-of-type(-n+2) {
      //   margin-bottom: 0;
      // }
      .icon {
        color: #C2CFE0;
        cursor: pointer;
        margin-left: 2px;
        &:hover {
          color: #ed4014;
        }
      }
    }
  }
}
// 表格
.table-wrap {
  padding-bottom: 61px;
  .batch-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 7px;
    .btn {
      height: 40px;
    }
  }
}
</style>
