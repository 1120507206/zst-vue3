<template>
  <div ref="viewerDiv" />
</template>
<script lang="ts">
import {
  defineComponent,
  onMounted,
  Ref,
  ref,
  toRefs,
  watch,
} from 'vue';
import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'codemirror/lib/codemirror.css'; // Editor's Dependency Style
import '@toast-ui/editor/dist/toastui-editor-viewer.css';

interface TuiEditorViewerSetupData {
  viewerDiv: Ref;
}

export default defineComponent({
  name: 'TuiEditorViewer',
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  setup(props): TuiEditorViewerSetupData {
    const { value } = toRefs(props);
    const viewerDiv = ref<HTMLElement>();
    const viewerRef = ref<Viewer>();

    watch(value, () => {
      if (viewerRef.value) {
        viewerRef.value.setMarkdown(value.value);
      }
    });

    onMounted(() => {
      if (viewerDiv.value) {
        viewerRef.value = new Viewer({
          el: viewerDiv.value,
          initialValue: props.value,
          /*  events: {
              load: (param: Viewer) => {
              },
          } */
        });
      }
    });

    return {
      viewerDiv,
    };
  },
});
</script>
