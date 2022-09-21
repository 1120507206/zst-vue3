<template>
  <main class="main">
    <el-row :gutter="24">
      <el-col :span="4">
        <Sidebar @submit="sideSubmit" @getId="getSidId" :treeData="treeData" />
      </el-col>
      <el-col :span="20">
        <div>授权：</div>
        <el-tabs v-show="userId" v-model="activeName" class="tabs">
          <el-tab-pane label="广州楼盘接口" name="first">
            <el-button-group>
              <el-button
                :type="activeTab == 0 ? 'primary' : ''"
                @click="activeTab = 0"
                >有效期</el-button
              >
              <el-button
                :type="activeTab == 1 ? 'primary' : ''"
                @click="activeTab = 1"
                >接口</el-button
              >
            </el-button-group>
            <keep-alive style="margin-top: 20px;">
              <component :id="userId" v-bind:is="currentTabComponent"></component>
            </keep-alive>
          </el-tab-pane>
        </el-tabs>

        <el-empty v-if="!userId" description="请选择用户" />
      </el-col>
    </el-row>
  </main>
</template>

<script lang="ts" setup>
  import { reactive, ref, computed } from "vue";
  import Sidebar from "./components/sidebar.vue";
  import Validperiod from "./components/validperiod.vue";
  import Editperiod from "./components/editperiod.vue";
  import {getByName,getUserByAccountOrOrgId } from "./service"



  //左侧用户列表
  const treeData = ref([

  ]);
  //左侧查询
  const sideSubmit = async(value: any) => {
  const params = {
    account:value.account,
    orgId:value.orgId,
  }
   const { data: { success, message, obj } }  = await getUserByAccountOrOrgId(params)
  console.log('obj :>> ', obj);
   treeData.value = obj?obj:[];

  };
  //左侧的id
   let userId = ref<string>('')
  //左侧点击具体名称
  const getSidId = (id: any) => {
  userId.value = id
    console.log('左侧点击的id :>> ', id);

  };

  //右侧为空时
  const isEmpty = ref<Boolean>(false);

  //tab切换
  const activeName = ref("first");
  let activeTab = ref(0);
  const currentTabComponent = computed(() => {
    return activeTab.value == 0 ? Validperiod : Editperiod;
  });
</script>

<style lang="scss" scoped>
  .tabs {
    margin-top: 20px;
  }
</style>
