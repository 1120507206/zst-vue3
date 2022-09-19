<template>
  <div class="indexlayout-main-content">
    <iframe
      class="frame"
      :src="url"
    />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
} from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'ExternalLink',

  setup() {
    const route = useRoute();

    return {
      url: route.query.url,
    };
  },
});
</script>

<style lang="scss" scoped>
.indexlayout-main-content {
  position: relative;
  margin: -20px;
}

.frame {
  position: absolute;
  border: 0;
  width: 100%;
  min-height: calc(76vh + 20px);
}
</style>
