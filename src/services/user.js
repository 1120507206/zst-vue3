import request from '@/utils/request';

export default {
  login: (params) => request({
    url: '/login',
    method: 'POST',
    data: params,
  }),
  getUserMenu: () => request({
    url: '/login/getUserMenu',
    method: 'POST',
  }),
  logout: () => request({
    url: '/login/logout',
    method: 'POST',
  }),
};
// # sourceMappingURL=user.js.map
