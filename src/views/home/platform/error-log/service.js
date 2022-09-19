import apiBaseUrl from '@/config/apiBaseUrl';
import request from '@/utils/request';
/* 查询数据分页 */
export const searchPage = (params) => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/execLog/searchPage',
  method: 'POST',
  data: params,
});
/* 删除错误日志 */
export const deleteLog = (id) => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/execLog/delete',
  method: 'POST',
  params: {
    id,
  },
});
// # sourceMappingURL=service.js.map
