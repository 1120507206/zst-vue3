<template>
  <div class="home-layout">
    home
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
} from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'PortalLayout',

  setup() {
    const router = useRouter();

    onMounted(() => {
      router.replace('/home/index');
    });

    return {
      //
    };
  },
});
</script>

<style lang="scss">
@use '~@/assets/css/variables.scss';

.home-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}
</style>
