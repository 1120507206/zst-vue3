import BlankLayout from '@/layouts/BlankLayout.vue';
import process from './routes/process';
import car from './routes/car';
import system from './routes/system';
import platform from './routes/platform';

const IndexLayoutRoutes = [
  {
    icon: 'home',
    title: '管理平台',
    hidden: true,
    path: '/home',
    redirect: '/home/workplace',
    component: BlankLayout,
    children: [
      {
        icon: 'control',
        title: '首页',
        path: 'workplace',
        component: () => import('@/views/home/index.vue'),
      },
    ],
  },
  ...process,
  ...car,
  ...system,
  ...platform,
];
export default IndexLayoutRoutes;
// # sourceMappingURL=routes.js.map
