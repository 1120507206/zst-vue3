<template>
  <div>
    <el-button-group>
      <el-button
        :type="activeTab == 0 ? 'primary' : ''"
        :icon="Upload"
        @click="activeTab = 0"
        >导出</el-button
      >
      <el-button
        :type="activeTab == 1 ? 'primary' : ''"
        :icon="Download"
        @click="activeTab = 1"
        >导入</el-button
      >
    </el-button-group>
    <keep-alive>
      <component v-bind:is="currentTabComponent"></component>
    </keep-alive>
  </div>
</template>
<script lang="ts" setup>
  import { reactive, ref, computed } from "vue";
  import { Edit, Upload, Download } from "@element-plus/icons-vue";
  import DataImport from "./components/dataImport.vue";
  import DataExport from "./components/dataExport.vue";
  let activeTab = ref(1);
  const currentTabComponent = computed(() => {
    return activeTab.value == 0 ? DataExport : DataImport;
  });
</script>

<style lang="scss" scoped></style>
