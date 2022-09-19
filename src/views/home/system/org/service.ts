import { AxiosPromise } from 'axios';
import apiBaseUrl from '@/config/apiBaseUrl';
import request from '@/utils/request';
import { ReqParams, ResResult } from './data.d';

/* 组织机关树 */
export const getOrgTree = (): AxiosPromise<ResResult.GetOrgTree> => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/org/getOrgTree',
  method: 'POST',
});

/* 获取单条机构数据 */
export const get = (id: string): AxiosPromise<ResResult.Get> => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/org/get',
  method: 'GET',
  params: {
    orgId: id,
  },
});

/* 保存修改 */
export const save = (params: ReqParams.Save): AxiosPromise<ResResult.Save> => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/org/save',
  method: 'POST',
  data: params,
});

/* 查询数据分页 */
export const searchOrgPage = (
  params: ReqParams.SearchOrgPage,
): AxiosPromise<ResResult.SearchOrgPage> => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/org/searchOrgPage',
  method: 'POST',
  data: params,
});

/* 删除机构 */
export const deleteOrg = (id: string): AxiosPromise<ResResult.Delete> => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/org/delete',
  method: 'POST',
  params: {
    orgId: id,
  },
});
