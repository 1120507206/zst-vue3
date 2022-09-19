// 子路由改成绝对路径，不然和后端返回的菜单数据不好匹配，难以获取权限信息
import type { Component } from 'vue';
import BlankLayout from '@/layouts/BlankLayout.vue';
import type { RoutesDataItem } from '@/utils/routes';

const Link = (): Promise<Component> => import(/* webpackChunkName: "link" */ '@/views/link/index.vue');

const routes: RoutesDataItem[] = [
  {
    icon: 'home',
    title: '外链',
    hidden: false,
    path: '/link',
    redirect: '/link/index',
    component: BlankLayout,
    children: [
      {
        icon: 'control',
        title: '外链',
        path: '/link/index',
        component: Link,
      },
    ],
  },
];

export default routes;
