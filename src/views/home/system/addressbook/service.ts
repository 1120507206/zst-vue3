import { AxiosPromise } from 'axios';
import apiBaseUrl from '@/config/apiBaseUrl';
import request from '@/utils/request';
// import { ReqParams, ResResult } from './data.d';
const mockUrl = 'http://127.0.0.1:4523/m1/1639888-0-default'
/* 获取单个有效期 */
export const getUserIdentity = (
  params:any
): AxiosPromise => request({
  baseURL: apiBaseUrl.get('sys'),
  // baseURL: mockUrl,
  url: '/user_identity/get',
  method: 'GET',
   params
});

