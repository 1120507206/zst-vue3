import apiBaseUrl from '@/config/apiBaseUrl';
import request from '@/utils/request';
/* 查询数据分页 */
export const searchPage = (params) => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/integrate/searchPage',
  method: 'POST',
  data: params,
});
/* 新增 */
export const addDoc = (params) => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/integrate/save',
  method: 'POST',
  data: params,
});
/* 删除项 */
export const deleteDoc = (id) => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/integrate/delete',
  method: 'POST',
  params: {
    id,
  },
});
export const MenuLinkList = {
  /** 获取已关联菜单清单 */
  getRelateList: (platformId) => request({
    baseURL: apiBaseUrl.get('sys'),
    url: `/integrate/getRelateList?platformId=${platformId}`,
    method: 'POST',
  }),
  /** 菜单 */
  getMenuList: () => request({
    baseURL: apiBaseUrl.get('sys'),
    url: '/integrate/menuList',
    method: 'POST',
  }),
  /** 设置关联菜单 */
  setLink: (params) => request({
    baseURL: apiBaseUrl.get('sys'),
    url: '/integrate/menumanage',
    method: 'POST',
    data: params,
  }),
};
// # sourceMappingURL=service.js.map
