import BlankLayout from '@/layouts/BlankLayout.vue';

const Process = () => import(/* webpackChunkName: "process" */ '@/views/home/process/index.vue');
const ProcessAudit = () => import(/* webpackChunkName: "process" */ '@/views/home/process/audit.vue');
const routes = [
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
// # sourceMappingURL=process.js.map
