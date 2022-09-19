import { RoutesDataItem } from '@/utils/routes';
import BlankLayout from '@/layouts/BlankLayout.vue';
import IFrame from '@/views/iframe/index.vue';

// import process from './routes/process';
import system from './routes/system';
import platform from './routes/platform';
// import externalLink from './routes/externalLink';

const IndexLayoutRoutes: Array<RoutesDataItem> = [
  {
    icon: 'home',
    title: '首页',
    hidden: true,
    path: '/home',
    redirect: '/home/index',
    component: BlankLayout,
    children: [
      {
        icon: 'control',
        title: '首页',
        path: 'index',
        // component: () => import(`@/views/home/index.vue`),
        component: () => import(`@/views/home/index.vue`),
      },
      {
        icon: 'control',
        title: '修改密码',
        path: 'changePwd',
        component: () => import('@/views/user/changePwd.vue'),
      },
      {
        icon: 'control',
        title: '',
        path: 'iframe',
        component: IFrame,
      },
      // {
      //   icon: 'edit',
      //   title: 'index-layout.menu.home.custom-breadcrumbs',
      //   path: 'custombreadcrumbs',
      //   component: () => import('@/views/custom-breadcrumbs/index.vue'),
      //   breadcrumb: [
      //     {
      //       title: 'index-layout.menu.home.custom-breadcrumbs',
      //       path: '/home/custombreadcrumbs',
      //     },
      //     {
      //       title: 'index-layout.menu.home',
      //       path: '/home',
      //     },
      //     {
      //       title: 'index-layout.menu.home.custom-breadcrumbs.liqingsong.cc',
      //       path: 'http://liqingsong.cc',
      //     },
      //   ],
      // },
      // {
      //   icon: 'detail',
      //   title: 'index-layout.menu.home.docs',
      //   path: 'http://admin-element-vue.liqingsong.cc/',
      //   belongTopMenu: '/home',
      //   redirect: '',
      // },
    ],
  },
  ...system,
  ...platform,
];

export default IndexLayoutRoutes;
