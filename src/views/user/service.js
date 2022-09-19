import request from '@/utils/request';
import apiBaseUrl from '@/config/apiBaseUrl';

export const login = (params) => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/login',
  method: 'POST',
  data: params,
});
export const getUserMenu = () => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/login/getUserMenu',
  method: 'POST',
});
export const logout = () => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/login/logout',
  method: 'POST',
});
// # sourceMappingURL=service.js.map
