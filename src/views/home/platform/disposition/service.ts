import type { AxiosPromise } from 'axios';
import apiBaseUrl from '@/config/apiBaseUrl';
import request from '@/utils/request';
import type { ReqParams, ResResult } from './data.d';

/* 查询数据分页 */
export const searchPage = (
  data: ReqParams.SearchPage,
): AxiosPromise<ResResult.SearchPage> => request({
  baseURL: apiBaseUrl.get('wf'),
  url: '/modeler/list',
  method: 'POST',
  data,
});

/* 新增 */
export const Add = (params: ReqParams.add): AxiosPromise<ResResult.Save> => request({
  baseURL: apiBaseUrl.get('wf'),
  url: '/modeler/create',
  method: 'POST',
  data: params,
});

/* 删除项 */
export const Delete = (modelId: string): AxiosPromise<ResResult.Delete> => request({
  baseURL: apiBaseUrl.get('wf'),
  url: `/modeler/remove/${modelId}`,
  method: 'delete',
});

/* 部署 */
export const Deploy = (modelId: string): AxiosPromise<ResResult.Deploy> => request({
  baseURL: apiBaseUrl.get('wf'),
  url: `/modeler/deploy/${modelId}`,
  method: 'GET',
});
