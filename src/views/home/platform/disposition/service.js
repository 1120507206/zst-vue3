import apiBaseUrl from '@/config/apiBaseUrl';
import request from '@/utils/request';
/* 查询数据分页 */
export const searchPage = (params) => request({
  baseURL: apiBaseUrl.get('wf'),
  url: '/modeler/list',
  method: 'GET',
  params,
});
/* 新增 */
export const Add = (params) => request({
  baseURL: apiBaseUrl.get('wf'),
  url: '/modeler/create',
  method: 'POST',
  data: params,
});
/* 删除项 */
export const Delete = (modelId) => request({
  baseURL: apiBaseUrl.get('wf'),
  url: `/modeler/remove/${modelId}`,
  method: 'delete',
});
// # sourceMappingURL=service.js.map
