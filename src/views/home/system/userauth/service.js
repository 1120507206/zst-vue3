import apiBaseUrl from '@/config/apiBaseUrl';
import request from '@/utils/request';
/* 取消角色用户关联 */
export const cancelUserAuth = (params) => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/role/cancelUserAuth',
  method: 'POST',
  data: params,
});
/* 查询当前角色关联的菜单 */
export const findMenuAuthTree = (id) => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/role/findMenuAuthTree',
  method: 'POST',
  params: {
    roleId: id,
  },
});
/* 查询当前角色关联的用户 */
export const findRoleAndUser = (id) => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/role/findRoleAndUser',
  method: 'POST',
  params: {
    roleId: id,
  },
});
/* 查询当前角色未关联的用户 */
export const findRoleNotRelateUser = (params) => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/role/findRoleNotRelateUser',
  method: 'POST',
  data: params,
});
/* 获取单条角色数据 */
export const get = (id) => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/role/get',
  method: 'GET',
  params: {
    orgId: id,
  },
});
/* 角色关联用户 */
export const relateUserAuth = (params) => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/role/relateUserAuth',
  method: 'POST',
  data: params,
});
/* 保存用户信息 */
export const save = (params) => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/role/save',
  method: 'POST',
  data: params,
});
/* 关联菜单角色 */
export const saveMenuRole = (params) => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/role/saveMenuRole',
  method: 'POST',
  data: params,
});
/* 查询数据分页 */
export const searchRolePage = (params) => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/role/searchRolePage',
  method: 'POST',
  data: params,
});
// # sourceMappingURL=service.js.map
