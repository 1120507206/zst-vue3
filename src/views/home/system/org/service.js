import apiBaseUrl from '@/config/apiBaseUrl';
import request from '@/utils/request';
/* 组织机关树 */
export const getOrgTree = () => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/org/getOrgTree',
  method: 'POST',
});
/* 获取单条机构数据 */
export const get = (id) => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/org/get',
  method: 'GET',
  params: {
    orgId: id,
  },
});
/* 保存修改 */
export const save = (params) => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/org/save',
  method: 'POST',
  data: params,
});
/* 查询数据分页 */
export const searchOrgPage = (params) => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/org/searchOrgPage',
  method: 'POST',
  data: params,
});
/* 删除机构 */
export const deleteOrg = (id) => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/org/delete',
  method: 'POST',
  params: {
    orgId: id,
  },
});
// # sourceMappingURL=service.js.map
