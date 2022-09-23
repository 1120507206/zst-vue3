<template>
  <div class="">
    <el-row>
      <el-col :span="4">
        <el-button type="primary" @click="add">添加</el-button>
        <el-button type="primary" @click="search">查询</el-button>
      </el-col>
      <el-col :span="4"> </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column type="index" label="序号" width="180" />
          <el-table-column prop="name" label="姓名" />
          <el-table-column prop="phone" label="手机号" />
          <el-table-column prop="email" label="邮箱" />
          <el-table-column prop="updateTime" label="更新时间" />
          <el-table-column label="操作">
            <template #default="scope">
              <el-button
                size="small"
                @click="handleEdit(scope.$index, scope.row)"
                >编辑</el-button
              >
              <el-button
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
      <el-col :span="24">
        <el-pagination
          :currentPage="pageable.pageIndex"
          :page-size="pageable.pageSize"
          :hide-on-single-page="isShowPage"
          background
          layout="prev, pager, next, jumper"
          :total="pageable.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </el-col>
    </el-row>

    <el-dialog v-model="addVisible" width="25%" :title="dialogTitle + '人员'">
      <el-form
        :model="addModelData"
        ref="formRef"
        :rules="formRules"
        label-width="80px"
      >
        <el-form-item label="姓名" prop="name">
          <el-input
            v-model="addModelData.name"
            placeholder="请输入姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model="addModelData.phone"
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="addModelData.email"
            placeholder="请输入邮箱"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addVisible = false">取消</el-button>
          <el-button type="primary" @click="addSave">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from "vue";
  import { phone, email } from "@/utils/validate";
  import { ElMessage } from "element-plus";
  import { useHandleData } from "@/hooks/useHandleData";
  import { useTable } from "@/hooks/useTable";

  import { getListPage, saveOrUpdate, deleteUscontactsInfo } from "./service";
  //新增表单
  const addModelData = reactive({
    id: "",
    name: "",
    phone: "",
    email: "",
  });
  const formRef = ref();
  const dialogTitle = ref("新增");
  //表单检验
  const formRules = {
    name: [
      {
        required: true,
        message: "请输入用户名",
        trigger: "blur",
      },
    ],
    phone: [
      {
        required: true,
        validator: phone,
        trigger: "blur",
      },
    ],
    email: [
      {
        required: true,
        validator: email,
        trigger: "blur",
      },
    ],
  };
  let isEdit = false;
  //编辑相关
  const handleEdit = (index: any, row: any) => {
  console.log('row :>> ', row);
    isEdit = true;
    dialogTitle.value = "编辑";
    addVisible.value = true;
    Object.assign(addModelData,{...row})

  };
  //新增相关
  const addVisible = ref(false);
  const add = () => {
    isEdit = false;
    dialogTitle.value = "新增";
    addModelData.id = "";
    addVisible.value = true;
    formRef.value.resetFields();
  };
  //保存
  const addSave = async () => {
    await formRef.value.validate((valid: any, fields: any) => {
      if (valid) {
        console.log("submit!");
        addVisible.value = false;
        saveForm();
      } else {
        // console.log('error submit!', fields)
      }
    });
  };
  const saveForm = async () => {
    const params = { ...addModelData };
    const {
      data: { success, message, obj },
    } = await saveOrUpdate(params);
    if (success) {
      if (isEdit) {
        ElMessage.success("修改成功！");
      } else {
        ElMessage.success("添加成功！");
      }
    } else {
      ElMessage.error(message);
    }
    search();
    // getPageData();
  };

  //删除按钮
  const handleDelete = async (index: any, row: any) => {
    const params = {
      id: row.id,
    };
    await useHandleData(deleteUscontactsInfo, params.id, `删除该联系人`);
    search();
    // getPageData();
  };


//表格hooks
  const {
    tableData,
    pageable,
    searchParam,
    searchInitParam,
    isShowPage,
    getTableList,
    search,
    reset,
    handleSizeChange,
    handleCurrentChange,
  } = useTable(getListPage);

</script>

<style lang="scss" scoped></style>
