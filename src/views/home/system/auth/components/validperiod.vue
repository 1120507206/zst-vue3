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
        <el-button type="primary" class="button" @click="addSave">
          确定</el-button
        >
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
              <el-button
                v-if="showDel(scope.row)"
                size="small"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
                >删除</el-button
              >
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
          :current-page="pagination.current"
          :page-size="pagination.pageSize"
          :total="pagination.total"
          @current-change="pagination.onChange"
        />
      </el-col>
    </el-row>
    <el-dialog v-model="editVisible" width="25%" title="编辑有效期">
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
          <el-button type="primary" @click="editSave">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
  import { ElMessage } from "element-plus";
  import { reactive, ref, watch,onMounted } from "vue";
  import { useHandleData } from "@/hooks/useHandleData";
  import {
    getSearchLabelPage,
    saveUserIdentity,
    deleteUserIdentity,
  } from "../service";
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
  const addSave = async () => {
    if (timeList.value.length === 0) {
      ElMessage.error("请先选择时间区间！");
      return;
    }
    const validDateFrom = timeList.value[0];
    const validDateEnd = timeList.value[1];
    const userId = props.id;
    // const userId = "1"; //测试数据
    console.log("validDateEnd :>> ", typeof validDateEnd);
    const params = {
      userId,
      validDateFrom,
      validDateEnd,
      labelDictType: "test",
      labelValue1: 5, //新增时，接口并发数默认为5
      //   validDateFrom: validDateFrom,
      // userId: userId,
      // validDateEnd: validDateEnd
    };

    const {
      data: { success, message, obj },
    } = await saveUserIdentity(params);

    if (success) {
      ElMessage.success("新增成功！");
    } else {
      ElMessage.error(message);
    }
    getPageData();
    console.log("这是保存", obj);
  };

  const editTimeList = ref<any>([]);
  const editVisible = ref(false);
  //编辑的参数
  let editParams = {
    validDateFrom: "",
    userId: "",
    id: "",
    validDateEnd: "",
  };
  //编辑按钮
  const handleEdit = (index: any, row: any) => {
    const { validDateFrom, validDateEnd, userId, id } = row;
    editParams = {
      validDateFrom,
      validDateEnd,
      userId,
      id,
    };
    console.log("row", row);
    console.log("editParams", editParams);
    editTimeList.value = [validDateFrom, validDateEnd];
    editVisible.value = true;
  };
  //编辑保存
  const editSave = async () => {
    editVisible.value = false;
    editParams.validDateFrom = editTimeList.value[0];
    editParams.validDateEnd = editTimeList.value[1];
    const {
      data: { success, message, obj },
    } = await saveUserIdentity(editParams);
    if (success) {
      ElMessage.success("修改成功！");
    } else {
      ElMessage.error(message);
    }
    getPageData();
  };

  //是否显示编辑按钮
  const showEdit = (row: any) => {
    const { validDateEnd } = row;
    const endTime = new Date(validDateEnd);
    const nowTime = new Date();
    return nowTime < endTime;
  };
  // const delVisible = ref(false);
  //删除按钮
  const handleDelete = async (index: any, row: any) => {
    const params = {
      id: row.id,
    };
    await useHandleData(deleteUserIdentity, params.id, `删除该有效期`);
    getPageData();
  };
  //是否显示删除按钮
  const showDel = (row: any) => {
    const { validDateFrom, validDateEnd } = row;
    const startTime = new Date(validDateFrom);
    const endTime = new Date(validDateEnd);
    const nowTime = new Date();
    return nowTime < startTime;
    // return( startTime <= nowTime) && ( nowTime <= endTime);
  };

  //是否屏蔽分页控件
  const isShowPage = ref(true);
  const pagination = reactive({
    current: 1, //
    pageSize: 10,
    total: 20, //
    onChange: (page:any) => {
    pagination.current = page
    searchFrom.pageIndex = page
    getPageData()
    },
  });

  //表格数据
  const tableData = ref([]);

  //搜索条件
  const searchFrom = reactive({
    pageIndex: 1,
    pageSize: 10,
    labelDictType: "test",
    userId: props.id,
    effective: false,
  });
  //查询条件
  const getPageData = async () => {
    const params = {
      pageIndex: searchFrom.pageIndex,
      pageSize: searchFrom.pageSize,
      labelDictType: searchFrom.labelDictType,
      userId: searchFrom.userId,
      // userId: "1", //测试数据
      effective: searchFrom.effective,
    };
    const {
      data: { success, message, obj },
    } = await getSearchLabelPage(params);
    if (obj.total>10) {
      isShowPage.value = false
    }else{
     isShowPage.value =true
    }
  pagination.total = obj.total || 0;
    tableData.value = obj.data ? obj.data : [];
    console.log("obj5555 :>> ", obj);
  };
  //监听函数
  watch(
    () => props.id,
    (val, old) => {
      searchFrom.userId = val;
      getPageData();
      console.log(" 监听id变化", val);
    }
  );
  onMounted(() => {
      getPageData();

  })
</script>

<style lang="scss" scoped>
  .button {
    margin-left: 25px;
    margin-bottom: 5.5px;
  }
</style>
