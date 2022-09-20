<template>
  <div>
    <el-row>
      <el-col :span="20" :offset="4">
        <span> 设置有效期：</span>
        <el-date-picker
          v-model="timeList"
          type="daterange"
          value-format="YYYY-MM-DD"
          @change="timeChange"
          :disabled-date="disabledDate"
          range-separator="-"
          start-placeholder="选择有效期开始时间"
          end-placeholder="选择有效期结束时间"
        />
        <el-button type="primary" class="button" @click="addSave"> 确定</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="17" :offset="3">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column type="index" label="序号" width="180" />
          <el-table-column
            prop="validDateFrom"
            label="有效期开始时间"
            width="180"
          />
          <el-table-column prop="validDateEnd" label="有效期结束时间" />
          <el-table-column prop="updateTime" label="更新时间" />
          <el-table-column label="操作">
            <template #default="scope">
              <el-button
                size="small"
                v-if="showEdit(scope.row)"
                @click="handleEdit(scope.$index, scope.row)"
                >编辑</el-button
              >

              <el-popover
                v-model:visible="delVisible"
                placement="top"
                trigger="click"
                width="200px"
              >
                <p>确定删除该有效期？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="small" text @click="delVisible = false"
                    >取消</el-button
                  >
                  <el-button
                    size="small"
                    type="primary"
                    @click="handleDelete(scope.$index, scope.row)"
                    >确定</el-button
                  >
                </div>
                <template #reference>
                  <el-button   v-if="showDel(scope.row)" size="small" type="danger">删除</el-button>
                </template>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row justify="end" style="margin-top: 20px;">
      <el-col :span="17" :offset="3">
        <el-pagination
          background
          :hide-on-single-page="isShowPage"
          layout="prev, pager, next, jumper"
          :total="5"
        />
      </el-col>
    </el-row>
      <el-dialog
    v-model="editVisible"
    width="25%"
    title="编辑有效期"
  >
    <el-date-picker
          v-model="editTimeList"
          type="daterange"
          value-format="YYYY-MM-DD"
          @change="timeChange"
          :disabled-date="disabledDate"
          range-separator="-"
          start-placeholder="选择有效期开始时间"
          end-placeholder="选择有效期结束时间"
        />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editVisible = false">取消</el-button>
        <el-button type="primary" @click="editSave"

          >确定</el-button
        >
      </span>
    </template>
  </el-dialog>
  </div>
</template>

<script lang="ts" setup>
  import { ElMessage } from "element-plus";
import { reactive, ref, watch } from "vue";
  const tableData = ref([
    {
      validDateFrom: "2024-02-01",
      validDateEnd: "2033-02-01",
      updateTime: "2022-08-13 12:00:00",
    },
  ]);
  // 时间组件
  const timeList = ref([]);
  const oneDayMillisecond: number = 86400000; //一天的毫秒数
  const disabledDate = (time: Date) => {
    return time.getTime() < Date.now() - oneDayMillisecond;
  };
  //时间改变
  const timeChange = (timeArr: Date) => {
    console.log("timeArr", timeArr);
  };
  //id
  const props = defineProps({
    id: { type: String, default: "" },
  });

//新增-确定按钮
const addSave = ()=>{
if (timeList.value.length===0) {
 ElMessage.error('请先选择时间区间！')
 return
}
console.log('这是保存',timeList )

}

  const editTimeList = ref<any>([]);
  const editVisible = ref(false);
  //编辑按钮
  const handleEdit = (index: any, row: any) => {
  const { validDateFrom,validDateEnd, } = row;
  editTimeList.value = [validDateFrom,validDateEnd]
  editVisible.value = true
  };
//编辑保存
const editSave = ()=>{
  editVisible.value = false

}

  //是否显示编辑按钮
  const showEdit = (row: any) => {
 const { validDateEnd } = row;
    const endTime = new Date(validDateEnd);
    const nowTime = new Date();
    return nowTime < endTime;


  };
  const delVisible = ref(false);
  //删除按钮
  const handleDelete = (index: any, row: any) => {
    delVisible.value = false;
  };
  //是否显示删除按钮
  const showDel = (row: any) => {
     const { validDateFrom,validDateEnd, } = row;
    const startTime = new Date(validDateFrom);
    const endTime = new Date(validDateEnd);
    const nowTime = new Date();
      return nowTime < startTime;
    // return( startTime <= nowTime) && ( nowTime <= endTime);
  };


  //是否屏蔽分页控件
  const isShowPage = ref(true);
  //监听函数
  watch(
    () => props.id,
    (val, old) => {
      console.log(" 监听id变化", val);
    }
  );
</script>

<style lang="scss" scoped>
  .button {
    margin-left: 25px;
    margin-bottom: 5.5px;
  }
</style>
