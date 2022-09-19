import type { AxiosPromise } from 'axios';
import apiBaseUrl from '@/config/apiBaseUrl';
import request from '@/utils/request';
import type { ReqParams, ResResult } from './data.d';

/* 查询数据分页 */
export const searchPage = (
  params: ReqParams.SearchPage,
): AxiosPromise<ResResult.SearchPage> => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/tenant/searchPage',
  method: 'POST',
  data: params,
});

/* 新增 */
export const addDoc = (params: ResResult.DictFormData): AxiosPromise<ResResult.Void> => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/tenant/save',
  method: 'POST',
  data: params,
});

/* 机构清单 */
export const getMenuTree = (id: string): AxiosPromise<ResResult.TreeItemRes> => request({
  baseURL: apiBaseUrl.get('sys'),
  url: `/tenant/getMenuTree?teantId=${id}`,
  method: 'POST',
}, 'hideLoad');

/* 租户菜单权限 */
export const saveMenuTeant = (params: ReqParams.setAuthByMenu): AxiosPromise<ResResult.Void> => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/tenant/saveMenuTeant',
  method: 'POST',
  data: params,
});

/* 删除项 */
export const deleteDoc = (id: string): AxiosPromise<ResResult.Delete> => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/tenant/delete',
  method: 'POST',
  params: {
    id,
  },
});

interface IOrg {
  getUserList:(teanId:string) => AxiosPromise<ResResult.OrgListRes>
  setUserLinkToOrg:(params: ReqParams.setAuthByMenu) => AxiosPromise<ResResult.Void>
  getOrgList:() => AxiosPromise<ResResult.OrgListRes>
}

export const Org:IOrg = {
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
