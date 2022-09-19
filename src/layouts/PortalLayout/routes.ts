import { RoutesDataItem } from '@/utils/routes';
import BlankLayout from '@/layouts/BlankLayout.vue';

const HomeLayoutRoutes: Array<RoutesDataItem> = [
  {
    icon: 'index',
    title: '一站式物联网平台',
    path: '/portal',
    // redirect: '/portal/index',
    redirect: '/home/index',
    component: BlankLayout,
    children: [
      {
        icon: 'index',
        title: '一站式物联网平台',
        path: 'index',
        component: () => import('@/views/portal/index.vue'),
      },
    ],
  },
];

export default HomeLayoutRoutes;
