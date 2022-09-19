import type { AxiosPromise } from 'axios';
import apiBaseUrl from '@/config/apiBaseUrl';
import request from '@/utils/request';
import type { ReqParams, ResResult } from './data.d';

/* 查询数据分页 */
export const searchPage = (
  params: ReqParams.SearchPage,
): AxiosPromise<ResResult.SearchPage> => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/constant/searchPage',
  method: 'POST',
  data: params,
});

/* 新增字典项 */
export const addDoc = (params: ResResult.DictFormData): AxiosPromise<ResResult.Save> => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/constant/save',
  method: 'POST',
  data: params,
});

/* 删除字典项 */
export const deleteDoc = (id: string): AxiosPromise<ResResult.Delete> => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/constant/delete',
  method: 'POST',
  params: {
    id,
  },
});
