import type { AxiosPromise } from 'axios';
import apiBaseUrl from '@/config/apiBaseUrl';
import request from '@/utils/request';
import type { ReqParams, ResResult } from './data.d';

/* 通用删除 */
export const commonDel = (params: ReqParams.CommonDel): AxiosPromise<ResResult.CommonDel> => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/online/commonDel',
  method: 'POST',
  data: params,
});

/* 通用列表 */
export const commonList = (params: ReqParams.CommonList): AxiosPromise<ResResult.CommonList> => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/online/commonList',
  method: 'POST',
  data: params,
});

/* 通用新增/修改 */
export const commonSave = (params: ReqParams.CommonSave): AxiosPromise<ResResult.CommonSave> => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/online/commonSave',
  method: 'POST',
  data: params,
});

/* 获取单条数据 */
export const get = (id: string): AxiosPromise<ResResult.Get> => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/online/get',
  method: 'POST',
  data: {
    id,
  },
});

/* 新增/修改 */
export const save = (params: ReqParams.Save): AxiosPromise<ResResult.Save> => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/online/save',
  method: 'POST',
  data: params,
});

/* 查询数据分页 */
export const searchPage = (params: ReqParams.SearchPage): AxiosPromise<ResResult.SearchPage> => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/online/searchPage',
  method: 'POST',
  data: params,
});
