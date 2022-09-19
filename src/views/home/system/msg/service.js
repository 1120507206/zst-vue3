import apiBaseUrl from '@/config/apiBaseUrl';
import request from '@/utils/request';
/* 保存修改 */
export const save = (params) => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/sysMsg/save',
  method: 'POST',
  data: params,
});
/* 查询数据分页 */
export const searchPage = (params) => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/sysMsg/searchPage',
  method: 'POST',
  data: params,
});
/* 删除消息 */
export const deleteMsg = (id) => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/sysMsg/delete',
  method: 'POST',
  params: {
    id,
  },
});
// # sourceMappingURL=service.js.map
