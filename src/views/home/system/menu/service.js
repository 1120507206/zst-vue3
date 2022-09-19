import apiBaseUrl from '@/config/apiBaseUrl';
import request from '@/utils/request';
/* 菜单树 */
export const getMenuTree = () => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/menu/getMenuTree',
  method: 'POST',
});
/* 获取单条菜单数据 */
export const get = (id) => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/menu/get',
  method: 'GET',
  params: {
    menuId: id,
  },
});
/* 保存修改 */
export const save = (params) => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/menu/save',
  method: 'POST',
  data: params,
});
/* 查询数据分页 */
export const searchMenuPage = (params) => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/menu/searchMenuPage',
  method: 'POST',
  data: params,
});
/* 删除菜单 */
export const deleteMenu = (id) => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/menu/delete',
  method: 'POST',
  params: {
    menuId: id,
  },
});
// # sourceMappingURL=service.js.map
