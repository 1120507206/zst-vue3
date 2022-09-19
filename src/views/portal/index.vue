<template>
  <div class="indexlayout-main-content">
    index
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
} from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'Home',

  setup() {
    const router = useRouter();

    onMounted(() => {
      router.replace('/home/index');
    });
  },
});
</script>
