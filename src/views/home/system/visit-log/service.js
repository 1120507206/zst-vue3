import apiBaseUrl from '@/config/apiBaseUrl';
import request from '@/utils/request';
/* 查询数据分页 */
export const searchPage = (params) => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/callLog/searchPage',
  method: 'POST',
  data: params,
});
/* 删除登录日志 */
export const deleteLog = (id) => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/callLog/delete',
  method: 'POST',
  params: {
    id,
  },
});
// # sourceMappingURL=service.js.map
