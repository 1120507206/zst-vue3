/**
 * 设置 html Title  composables
 * @author LiQingSong
 */
import { onMounted, watch } from 'vue';
// import { useI18n } from 'vue-i18n';
import settings from '@/config/settings';

export default function useTitle(route) {
  // const { t } = useI18n();
  // 需要国际化的话再看如何重构了
  const setTitle = (title) => {
    // document.title = `${t(title)} - ${settings.siteTitle}`;
    document.title = `${title} - ${settings.siteTitle}`;
  };
  watch(route, (routeItem) => {
    setTitle(routeItem.title);
  });
  onMounted(() => {
    setTitle(route.value.title);
  });
}
// # sourceMappingURL=useTitle.js.map
