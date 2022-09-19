import { createApp } from 'vue';
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
// 样式初始化
import 'normalize.css';

// 全局样式
import '@/assets/css/global.scss';

// // 引入 ElementUI
// import ElementPlus from 'element-plus';

// 导入 svg
import dayjs from 'dayjs';
import { importAllSvg } from '@/components/IconSvg/index';

import App from '@/App.vue';
import router from '@/config/routes';
import store from '@/config/store';
import i18n from '@/config/i18n';

import 'dayjs/locale/zh-cn';

// 自定义form表单iconfont
import '@/iconfont/iconfont.css';

dayjs.locale('zh-cn');

importAllSvg();

const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(store);
app.use(ElementPlus)
app.use(router);
// app.use(ElementPlus, { size: 'small' });
app.config.globalProperties.$ELEMENT = { size: 'small' };
app.use(i18n);
app.mount('#app');

// vue-devtool
// eslint-disable-next-line
const win: any = window;
if (process.env.NODE_ENV === 'development') {
  if ('__VUE_DEVTOOLS_GLOBAL_HOOK__' in win) {
    // eslint-disable-next-line
    win.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = app;
  }
}
