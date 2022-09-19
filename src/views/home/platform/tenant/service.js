import apiBaseUrl from '@/config/apiBaseUrl';
import request from '@/utils/request';
/* 查询数据分页 */
export const searchPage = (params) => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/tenant/searchPage',
  method: 'POST',
  data: params,
});
/* 新增 */
export const addDoc = (params) => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/tenant/save',
  method: 'POST',
  data: params,
});
/* 机构清单 */
export const getMenuTree = (id) => request({
  baseURL: apiBaseUrl.get('sys'),
  url: `/tenant/getMenuTree?teantId=${id}`,
  method: 'POST',
}, 'hideLoad');
/* 租户菜单权限 */
export const saveMenuTeant = (params) => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/tenant/saveMenuTeant',
  method: 'POST',
  data: params,
});
/* 删除项 */
export const deleteDoc = (id) => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/tenant/delete',
  method: 'POST',
  params: {
    id,
  },
});
export const Org = {
  /** 已关联机构的租户 */
  getUserList: (teantId) => request({
    baseURL: apiBaseUrl.get('sys'),
    url: `/tenant/orgRelateList?teantId=${teantId}`,
    method: 'POST',
  }),
  /** 租户关联机构 */
  setUserLinkToOrg: (params) => request({
    baseURL: apiBaseUrl.get('sys'),
    url: '/tenant/orgManage',
    method: 'POST',
    data: params,
  }),
  /** 机构列表 */
  getOrgList: async () => request({
    baseURL: apiBaseUrl.get('sys'),
    url: '/tenant/orgList',
    method: 'POST',
  }),
};
// # sourceMappingURL=service.js.map
