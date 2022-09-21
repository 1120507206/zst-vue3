<template>
  <div>
    <el-form :model="formData">
      <el-form-item label="">
        <el-input
          v-model="formData.account"
          class="el-input"
          placeholder="账号"
        />
      </el-form-item>
      <el-form-item label="">
        <el-input
          v-model="formData.companyName"
          class="el-input"
          placeholder="机构名称"
        />
      </el-form-item>
    </el-form>
    <el-button type="primary" style="margin-bottom: 10px;" @click="query">
      查询</el-button
    >
    <el-scrollbar class="tree" height="400px">

      <el-menu
        default-active="-1"
      >
        <el-menu-item  @click="itemclick(item)" :index="index" v-for=" (item,index) in treeData">
          <span>{{item.account}}</span>
        </el-menu-item>

      </el-menu>
      <!-- <el-tree :data="treeData"></el-tree> -->
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from "vue";
  interface SearchForm {
  account: string,
  orgId?: number,
}
  interface FilterEmits {
    (e: "submit", value: object): void;
    (e: "getId", id: string): void;
  }
  const emit = defineEmits<FilterEmits>();
  //表格数据
  const props = defineProps({
     treeData: { type: Array,  default: [] },
})
  //表单数据
  const formData = reactive({
    account: "",
    companyName: "",
  });

//点击侧边栏时间
const itemclick = (value:any)=>{
const id = value.id
   emit("getId", id);

}

  //查询
  const query = () => {
    emit("submit", formData);
  };
</script>

<style lang="scss" scoped>
  .tree {
    border: 1px solid #eee;
    width: 100%;
  }
  .main {
    &__header {
      margin-bottom: 16px;

      &-buttons {
        text-align: right;
      }
    }
    .el-input {
      // margin: 5px 0;
    }
  }
</style>
