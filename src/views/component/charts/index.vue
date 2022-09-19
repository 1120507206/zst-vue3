<template>
  <div class="chart-box">
    <div class="slot-area">
      <slot name="header" />
    </div>
    <div class="chart-area">
      <div
        ref="worksChartRef"
        style="height: 100%;"
      />
    </div>
    <!-- <div
        ref="worksChartRef"
        style="height: 100%;"
      /> -->
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  watch,
  PropType,
} from 'vue';
import {
  ElRow,
  ElCol,
} from 'element-plus';
import { EChartOption } from 'echarts';
import useEcharts from '@/composables/useEcharts';

// const worksChartOption: EChartOption = {
//   tooltip: {
//     trigger: 'item',
//   },
//   legend: {
//     top: '5%',
//     left: 'center',
//   },
//   series: [
//     {
//       name: 'Access From',
//       type: 'pie',
//       radius: ['40%', '70%'],
//       avoidLabelOverlap: false,
//       itemStyle: {
//         borderRadius: 10,
//         borderColor: '#fff',
//         borderWidth: 2,
//       },
//       label: {
//         show: false,
//         position: 'center',
//       },
//       emphasis: {
//         label: {
//           show: true,
//           fontSize: 40,
//           fontWeight: 'bold',
//         },
//       },
//       labelLine: {
//         show: false,
//       },
//       data: [],
//     },
//   ],
// };

export default defineComponent({
  components: {
    // ElRow,
    // ElCol,
  },
  props: {
    option: {
      type: Object as PropType<EChartOption>,
      default: () => ({}),
    },
  },
  setup(props) {
    const opt = computed(() => props.option);
    // echarts 图表
    const worksChartRef = ref<HTMLDivElement>();
    const echarts = useEcharts(worksChartRef, opt.value);
    // watch(worksChartRef, (cur) => {
    //   console.log(cur);
    //   const echarts = useEcharts(worksChartRef, worksChartOption);
    //   console.log(echarts);
    // });
    watch([echarts, opt.value], () => {
      console.log(opt);
      if (echarts.value) {
        echarts.value.setOption(opt.value);
      }
    });
    return {
      worksChartRef,
    };
  },
});
</script>

<style lang="scss" scoped>
.chart-box {
  display: flex;
  flex-direction: column;
  height: 100%;

  .slot-area {
  }
  .chart-area {
    flex: 1;
  }
}
</style>
