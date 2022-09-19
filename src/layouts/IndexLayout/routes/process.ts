// 子路由改成绝对路径，不然和后端返回的菜单数据不好匹配，难以获取权限信息
import type { Component } from 'vue';
import BlankLayout from '@/layouts/BlankLayout.vue';
import type { RoutesDataItem } from '@/utils/routes';

const Process = (): Promise<Component> => import(/* webpackChunkName: "process" */ '@/views/home/process/index.vue');
const ProcessAudit = (): Promise<Component> => import(/* webpackChunkName: "process" */ '@/views/home/process/audit.vue');
const ProcessCenter = (): Promise<Component> => import(/* webpackChunkName: "process" */ '@/views/home/process/center.vue');

const routes: RoutesDataItem[] = [
  {
    icon: 'home',
    title: '流程管理',
    hidden: false,
    path: '/process',
    redirect: '/process/todo',
    component: BlankLayout,
    children: [
      {
        icon: 'control',
        title: '流程中心',
        path: '/process/center',
        component: ProcessCenter,
      },
      {
        icon: 'control',
        title: '待办流程',
        path: '/process/todo',
        component: Process,
      },
      {
        icon: 'control',
        title: '已办流程',
        path: '/process/done',
        component: Process,
      },
      {
        icon: 'control',
        title: '待办审批',
        hidden: true,
        path: '/process/todo-audit',
        component: ProcessAudit,
      },
      {
        icon: 'control',
        title: '已办审批',
        hidden: true,
        path: '/process/done-audit',
        component: ProcessAudit,
      },
    ],
  },
];

export default routes;
