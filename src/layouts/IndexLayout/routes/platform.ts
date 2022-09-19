// 子路由改成绝对路径，不然和后端返回的菜单数据不好匹配，难以获取权限信息
import type { Component } from 'vue';
import BlankLayout from '@/layouts/BlankLayout.vue';
import type { RoutesDataItem } from '@/utils/routes';

// const Dictionary = (): Promise<Component> => import(/* webpackChunkName: "platform" */ '@/views/home/platform/dictionary/index.vue');
// const Tenant = (): Promise<Component> => import(/* webpackChunkName: "platform" */ '@/views/home/platform/tenant/index.vue');
// const Code = (): Promise<Component> => import(/* webpackChunkName: "platform" */ '@/views/home/platform/code/index.vue');
const Platform = (): Promise<Component> => import(/* webpackChunkName: "platform" */ '@/views/home/platform/disposition/index.vue');
const DataUphold = (): Promise<Component> => import(/* webpackChunkName: "platform" */ '@/views/home/platform/dataUphold/index.vue');
// const ErrorLog = (): Promise<Component> => import(/* webpackChunkName: "platform" */ '@/views/home/platform/error-log/index.vue');
// const Disposition = (): Promise<Component> => import(/* webpackChunkName: "platform" */ '@/views/home/platform/disposition/index.vue');
// const Test = (): Promise<Component> => import(/* webpackChunkName: "platform" */ '@/views/home/platform/test/index.vue');
// const CreateForm = (): Promise<Component> => import(/* webpackChunkName: "platform" */ '@/views/home/platform/createForm/index.vue');

const routes: RoutesDataItem[] = [
  {
    icon: 'home',
    title: '楼盘数据维护',
    hidden: false,
    path: '/platform',
    redirect: '/platform/platform',
    component: BlankLayout,
    children: [
      // {
      //   icon: 'control',
      //   title: '字典管理',
      //   path: '/platform/dictionary',
      //   component: Dictionary,
      // },

      // {
      //   icon: 'control',
      //   title: '代码生成',
      //   path: '/platform/code',
      //   component: Code,
      // },
      {
        icon: 'control',
        title: '平台管理',
        path: '/platform/platform',
        component: Platform,
      },
      {
        icon: 'control',
        title: '数据维护',
        path: '/platform/DataUphold',
        component: DataUphold,
      },
      // {
      //   icon: 'control',
      //   title: '异常日志',
      //   path: '/platform/error-log',
      //   component: ErrorLog,
      // },
      // {
      //   icon: 'control',
      //   title: '服务部署',
      //   path: '/platform/disposition',
      //   component: Disposition,
      // },

      // {
      //   icon: 'control',
      //   title: '合同台账',
      //   path: '/platform/standbook',
      //   component: IFrame,
      // },
      // {
      //   icon: 'control',
      //   title: '合同申请',
      //   path: '/platform/apply',
      //   component: IFrame,
      // },
    ],
  },
];

export default routes;
