import { onMounted, onBeforeUnmount, ref } from 'vue';
import { debounce } from 'lodash-es';
import echarts from 'echarts';
import 'echarts/theme/macarons';

export default function useEcharts(labRef, initOption, theme = 'macarons') {
  let ec;
  const chart = ref();
  const resizeHandler = debounce(() => {
    ec.resize();
  }, 100);
  onMounted(() => {
    if (labRef.value) {
      ec = echarts.init(labRef.value, theme);
      ec.setOption(initOption);
      chart.value = ec;
    }
    window.addEventListener('resize', resizeHandler);
  });
  onBeforeUnmount(() => {
    ec.dispose();
    window.removeEventListener('resize', resizeHandler);
  });
  return chart;
}
// # sourceMappingURL=useEcharts.js.map
