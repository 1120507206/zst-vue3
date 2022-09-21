// 子路由改成绝对路径，不然和后端返回的菜单数据不好匹配，难以获取权限信息
import type { Component } from 'vue';
import BlankLayout from '@/layouts/BlankLayout.vue';
import type { RoutesDataItem } from '@/utils/routes';

const Org = (): Promise<Component> => import(/* webpackChunkName: "system" */ '@/views/home/system/org/index.vue');
const User = (): Promise<Component> => import(/* webpackChunkName: "system" */ '@/views/home/system/user/index.vue');
const Menu = (): Promise<Component> => import(/* webpackChunkName: "system" */ '@/views/home/system/menu/index.vue');
const File = (): Promise<Component> => import(/* webpackChunkName: "system" */ '@/views/home/system/file/index.vue');
const UserAuth = (): Promise<Component> => import(/* webpackChunkName: "system" */ '@/views/home/system/userauth/index.vue');
const Auth = (): Promise<Component> => import(/* webpackChunkName: "system" */ '@/views/home/system/auth/index.vue');
const Msg = (): Promise<Component> => import(/* webpackChunkName: "system" */ '@/views/home/system/msg/index.vue');
const VisitLog = (): Promise<Component> => import(/* webpackChunkName: "system" */ '@/views/home/system/visit-log/index.vue');
const LoginLog = (): Promise<Component> => import(/* webpackChunkName: "system" */ '@/views/home/system/login-log/index.vue');
const Center = (): Promise<Component> => import(/* webpackChunkName: "system" */ '@/views/home/system/center/index.vue');
const AddressBook = (): Promise<Component> => import(/* webpackChunkName: "system" */ '@/views/home/system/addressbook/index.vue');
// const Center = (): Promise<Component> => import(/* webpackChunkName: "system" */ '@/views/home/system/center/index.vue');

const routes: RoutesDataItem[] = [
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
        title: '通讯录',
        path: '/system/addressbook',
        component: AddressBook,
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
        title: '用户权限管理',
        path: '/system/userauth',
        component: UserAuth,
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
      {
        icon: 'control',
        title: '创作中心',
        path: '/system/center',
        component: Center,
      },
    ],
  },
];

export default routes;
