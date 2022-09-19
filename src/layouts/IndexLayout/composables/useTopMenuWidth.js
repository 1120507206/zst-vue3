/**
 * 设置 IndexLayout TopMenuWidth
 * @author LiQingSong
 */
import {
  onMounted, ref, watch, nextTick, computed,
} from 'vue';
import { useI18n } from 'vue-i18n';

export default function useTopMenuWidth(topNavEnable) {
  const topMenuCon = ref(null);
  const topMenuWidth = ref('auto');
  const setWidth = async () => {
    await nextTick();
    if (topMenuCon.value && topNavEnable.value) {
      let width = 0;
      const child = topMenuCon.value.children;
      for (let index = 0, len = child.length; index < len; index += 1) {
        const element = child[index];
        width = width + element.offsetWidth + 0.5;
      }
      topMenuWidth.value = `${width}px`;
    } else {
      topMenuWidth.value = 'auto';
    }
  };
  watch(topNavEnable, () => {
    setWidth();
  });
  const { locale } = useI18n();
  const localeValue = computed(() => locale.value);
  watch(localeValue, () => {
    setWidth();
  });
  onMounted(() => {
    setWidth();
  });
  return {
    topMenuCon,
    topMenuWidth,
  };
}
// # sourceMappingURL=useTopMenuWidth.js.map
