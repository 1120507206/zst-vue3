import { RoutesDataItem } from '@/utils/routes';

const UserLayoutRoutes: Array<RoutesDataItem> = [
  {
    title: '用户登录',
    path: 'login',
    component: () => import('@/views/user/login.vue'),
  },
  // {
  //   title: '用户注册',
  //   path: 'register',
  //   component: () => import('@/views/user/register.vue'),
  // },
];

export default UserLayoutRoutes;
