import apiBaseUrl from '@/config/apiBaseUrl';
import request from '@/utils/request';
/* 获取单个用户数据 */
export const get = (id) => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/user/get',
  method: 'GET',
  params: {
    id,
  },
});
/* 保存修改 */
export const save = (params) => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/user/save',
  method: 'POST',
  data: params,
});
/* 保存用户身份 */
export const saveUserIdentity = (params) => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/user/saveUserIdentity',
  method: 'POST',
  data: params,
});
/* 修改用户密码 */
export const updatePasswordByAccount = (params) => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/user/updatePasswbyAccount',
  method: 'POST',
  data: params,
});
/* 重置用户密码 */
export const resetPassword = (id) => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/user/resetPassword',
  method: 'GET',
  params: {
    id,
  },
});
/* 查询数据分页 */
export const searchUserPage = (params) => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/user/searchUserPage',
  method: 'POST',
  data: params,
});
/* 获取用户所有身份数据 */
export const searchUserIdentityByUser = (id) => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/user/searchUserIdentityByUser',
  method: 'POST',
  params: {
    userId: id,
  },
});
/* 删除用户 */
export const deleteUser = (id) => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/user/delete',
  method: 'POST',
  params: {
    userId: id,
  },
});
// # sourceMappingURL=service.js.map
