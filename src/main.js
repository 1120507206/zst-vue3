import { createApp } from 'vue';
// 样式初始化
import 'normalize.css';
// 全局样式
import '@/assets/css/global.scss';
// // 引入 ElementUI
// import ElementPlus from 'element-plus';
// 导入 svg
import { importAllSvg } from '@/components/IconSvg/index';
import App from '@/App.vue';
import router from '@/config/routes';
import store from '@/config/store';
import i18n from '@/config/i18n';

importAllSvg();
const app = createApp(App);
app.use(store);
app.use(router);
// app.use(ElementPlus, { size: 'small' });
app.config.globalProperties.$ELEMENT = { size: 'small' };
app.use(i18n);
app.mount('#app');
// vue-devtool
// eslint-disable-next-line
const win = window;
if (process.env.NODE_ENV === 'development') {
  if ('__VUE_DEVTOOLS_GLOBAL_HOOK__' in win) {
    // eslint-disable-next-line
        win.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = app;
  }
}
// # sourceMappingURL=main.js.map
