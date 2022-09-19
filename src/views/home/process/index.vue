<template>
  <ProcessTable :type="type" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRoute } from 'vue-router';
import ProcessTable from './components/table.vue';

export default defineComponent({
  name: 'ProcessTodo',

  components: {
    ProcessTable,
  },

  setup() {
    const { path } = useRoute();

    return {
      type: path.includes('todo') ? 'todo' : 'done',
    };
  },
});
</script>

<style lang="scss" scoped></style>
