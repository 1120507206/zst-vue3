import BlankLayout from '@/layouts/BlankLayout.vue';

const HomeLayoutRoutes = [
  {
    icon: 'index',
    title: '一站式物联网平台',
    path: '/portal',
    // redirect: '/portal/index',
    redirect: '/home/workplace',
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
// # sourceMappingURL=routes.js.map
