import { AxiosPromise } from 'axios';
import apiBaseUrl from '@/config/apiBaseUrl';
import request from '@/utils/request';
import { ReqParams, ResResult } from './data.d';

/* 保存修改 */
export const save = (params: ReqParams.Save): AxiosPromise<ResResult.Save> => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/sysMsg/save',
  method: 'POST',
  data: params,
});

/* 查询数据分页 */
export const searchPage = (
  params: ReqParams.SearchPage,
): AxiosPromise<ResResult.SearchPage> => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/sysMsg/searchPage',
  method: 'POST',
  data: params,
});

/* 删除消息 */
export const deleteMsg = (id: string): AxiosPromise<ResResult.Delete> => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/sysMsg/delete',
  method: 'POST',
  params: {
    id,
  },
});
