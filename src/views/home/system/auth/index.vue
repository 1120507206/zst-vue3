<template>
  <main class="main">
    <el-row :gutter="24">
      <el-col :span="4">
        <Sidebar @submit="sideSubmit" @getId="getSidId" :treeData="treeData" :account="account" />
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
              <component :id="userId" ref="RefTestComponent" v-bind:is="currentTabComponent"></component>
            </keep-alive>
          </el-tab-pane>
        </el-tabs>

        <el-empty v-if="!userId" description="请选择用户" />
      </el-col>
    </el-row>
  </main>
</template>

<script lang="ts" setup>
  import { reactive, ref, computed ,watch} from "vue";
  import Sidebar from "./components/sidebar.vue";
  import Validperiod from "./components/validperiod.vue";
  import Editperiod from "./components/editperiod.vue";
  import {getByName,getUserByAccountOrOrgId } from "./service"
import { useRoute } from 'vue-router'
import { nextTick } from 'process'
 const account = ref<any>('')
 const route = useRoute()
// 定义一个对象关联上子组件的 ref 值（注意：这里的属性名必须跟子组件定义的 ref 值一模一样，否者会关联失效）
const RefTestComponent = ref(null)
// 延迟使用，因为还没挂载
nextTick(() => {
  RefTestComponent.value.getPageData()

})
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
  if ( route.query) {
account.value = route.query.account
getSidId(route.query.id)

}
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
