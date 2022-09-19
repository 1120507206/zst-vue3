<template>
  <div style="width: 100%;height: 76vh;">
    <iframe
      :src="url"
      style="width: 100%;height: 100%;"
      width="100%"
      height="100%"
      frameborder="0"
    />
  </div>
</template>

<script lang="ts">
import {
  ref, computed, defineComponent, onMounted,
} from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'IFrame',

  components: {
  },

  setup() {
    const urlConfig = {
      '/platform/standbook': 'https://testoa.yuway.com.cn/spa/cube/index.html#/main/cube/search?customid=1',
      '/platform/apply': 'https://testoa.yuway.com.cn/spa/workflow/static4form/index.html?_rdm=1640767102685#/main/workflow/req?iscreate=1&workflowid=44&isagent=0&beagenter=0&f_weaver_belongto_userid=&f_weaver_belongto_usertype=0&menuIds=-1,-8&menuPathIds=-1,-3,-8&menuidforportal=left_-8&tabTitle=5ZCI5ZCM55Sz6K+3&_key=kygg05',
    };
    const route = useRoute();
    console.log(route);
    const url = computed(() => urlConfig[route.fullPath]);
    // const { url } = route.query;
    // console.log(url);

    return {
      url,
    };
  },
});
</script>
