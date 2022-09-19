import { AxiosPromise } from 'axios';
import apiBaseUrl from '@/config/apiBaseUrl';
import request from '@/utils/request';
import { ReqParams, ResResult } from './data.d';

/* 查询数据分页 */
export const searchPage = (
  params: ReqParams.SearchPage,
): AxiosPromise<ResResult.SearchPage> => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/callLog/searchPage',
  method: 'POST',
  data: params,
});

/* 删除登录日志 */
export const deleteLog = (id: string): AxiosPromise<ResResult.Delete> => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/callLog/delete',
  method: 'POST',
  params: {
    id,
  },
});
