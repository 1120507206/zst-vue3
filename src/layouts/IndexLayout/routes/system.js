import BlankLayout from '@/layouts/BlankLayout.vue';

const Org = () => import(/* webpackChunkName: "system" */ '@/views/home/system/org/index.vue');
const User = () => import(/* webpackChunkName: "system" */ '@/views/home/system/user/index.vue');
const Menu = () => import(/* webpackChunkName: "system" */ '@/views/home/system/menu/index.vue');
const File = () => import(/* webpackChunkName: "system" */ '@/views/home/system/file/index.vue');
const Auth = () => import(/* webpackChunkName: "system" */ '@/views/home/system/auth/index.vue');
const Msg = () => import(/* webpackChunkName: "system" */ '@/views/home/system/msg/index.vue');
const VisitLog = () => import(/* webpackChunkName: "system" */ '@/views/home/system/visit-log/index.vue');
const LoginLog = () => import(/* webpackChunkName: "system" */ '@/views/home/system/login-log/index.vue');
const routes = [
  {
    icon: 'home',
    title: '系统管理',
    hidden: false,
    path: '/system',
    redirect: '/system/org',
    component: BlankLayout,
    children: [
      {
        icon: 'control',
        title: '组织管理',
        path: '/system/org',
        component: Org,
      },
      {
        icon: 'control',
        title: '用户管理',
        path: '/system/user',
        component: User,
      },
      {
        icon: 'control',
        title: '菜单管理',
        path: '/system/menu',
        component: Menu,
      },
      {
        icon: 'control',
        title: '文件处理',
        path: '/system/file',
        component: File,
      },
      {
        icon: 'control',
        title: '权限管理',
        path: '/system/auth',
        component: Auth,
      },
      {
        icon: 'control',
        title: '公告管理',
        path: '/system/message',
        component: Msg,
      },
      {
        icon: 'control',
        title: '访问日志',
        path: '/system/visit-log',
        component: VisitLog,
      },
      {
        icon: 'control',
        title: '登录日志',
        path: '/system/login-log',
        component: LoginLog,
      },
    ],
  },
];
export default routes;
// # sourceMappingURL=system.js.map
