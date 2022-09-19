import apiBaseUrl from '@/config/apiBaseUrl';
import request from '@/utils/request';
/* 查询数据分页 */
export const searchPage = (params) => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/constant/searchPage',
  method: 'POST',
  data: params,
});
/* 新增字典项 */
export const addDoc = (params) => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/constant/save',
  method: 'POST',
  data: params,
});
/* 删除字典项 */
export const deleteDoc = (id) => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/constant/delete',
  method: 'POST',
  params: {
    id,
  },
});
// # sourceMappingURL=service.js.map
