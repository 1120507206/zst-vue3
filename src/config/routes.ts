/**
 * 路由入口
 * @author LiQingSong
 */
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import { RoutesDataItem } from '@/utils/routes';

import SecurityLayout from '@/layouts/SecurityLayout.vue';

import PortalLayoutRoutes from '@/layouts/PortalLayout/routes';
import PortalLayout from '@/layouts/PortalLayout/index.vue';

import IndexLayoutRoutes from '@/layouts/IndexLayout/routes';
import IndexLayout from '@/layouts/IndexLayout/index.vue';

import UserLayoutRoutes from '@/layouts/UserLayout/routes';
import UserLayout from '@/layouts/UserLayout/index.vue';

const routes: Array<RoutesDataItem> = [
  {
    title: '',
    path: '/',
    component: SecurityLayout,
    children: [
      {
        title: '',
        path: '/',
        redirect: '/portal/index',
        component: PortalLayout,
        children: PortalLayoutRoutes,
      },
      {
        title: '',
        path: '/home',
        redirect: '/home/index',
        component: IndexLayout,
        children: IndexLayoutRoutes,
      },
    ],
  },
  {
    title: '',
    path: '/user',
    redirect: '/user/login',
    component: UserLayout,
    children: UserLayoutRoutes,
  },
  {
    title: '找不到页面',
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/404/index.vue'),
  },
];

const router = createRouter({
  scrollBehavior(/* to, from, savedPosition */) {
    return { top: 0 };
  },
  history: createWebHashHistory(process.env.BASE_URL),
  routes: routes as RouteRecordRaw[],
});

export default router;
