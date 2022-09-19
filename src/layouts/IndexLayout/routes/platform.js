import BlankLayout from '@/layouts/BlankLayout.vue';

const Dictionary = () => import(/* webpackChunkName: "platform" */ '@/views/home/platform/dictionary/index.vue');
const Tenant = () => import(/* webpackChunkName: "platform" */ '@/views/home/platform/tenant/index.vue');
const Code = () => import(/* webpackChunkName: "platform" */ '@/views/home/platform/code/index.vue');
const Platform = () => import(/* webpackChunkName: "platform" */ '@/views/home/platform/platform/index.vue');
const ErrorLog = () => import(/* webpackChunkName: "platform" */ '@/views/home/platform/error-log/index.vue');
const Disposition = () => import(/* webpackChunkName: "platform" */ '@/views/home/platform/disposition/index.vue');
const routes = [
  {
    icon: 'home',
    title: '平台管理',
    hidden: false,
    path: '/platform',
    redirect: '/platform/platform',
    component: BlankLayout,
    children: [
      {
        icon: 'control',
        title: '字典管理',
        path: '/platform/dictionary',
        component: Dictionary,
      },
      {
        icon: 'control',
        title: '租户管理',
        path: '/platform/tenant',
        component: Tenant,
      },
      {
        icon: 'control',
        title: '代码生成',
        path: '/platform/code',
        component: Code,
      },
      {
        icon: 'control',
        title: '平台管理',
        path: '/platform/platform',
        component: Platform,
      },
      {
        icon: 'control',
        title: '异常日志',
        path: '/platform/error-log',
        component: ErrorLog,
      },
      {
        icon: 'control',
        title: '服务部署',
        path: '/platform/disposition',
        component: Disposition,
      },
    ],
  },
];
export default routes;
// # sourceMappingURL=platform.js.map
