import BlankLayout from '@/layouts/BlankLayout.vue';

const CarApply = () => import(/* webpackChunkName: "car" */ '@/views/home/car/apply/index.vue');
const routes = [
  {
    icon: 'home',
    title: '用车管理',
    hidden: false,
    path: '/car',
    redirect: '/car/apply',
    component: BlankLayout,
    children: [
      {
        icon: 'control',
        title: '用车申请',
        path: '/car/apply',
        component: CarApply,
      },
    ],
  },
];
export default routes;
// # sourceMappingURL=car.js.map
