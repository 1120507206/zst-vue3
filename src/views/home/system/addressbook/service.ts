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
/* 查询通讯录分页数据 */
export const getListPage = (
  params:any
): AxiosPromise => request({
  baseURL: apiBaseUrl.get('sys'),
  // baseURL: mockUrl,
  url: '/contacts_info/listPage',
  method: 'POST',
  data: params,
});
/*保存通讯录 */
export const saveOrUpdate = (
  params:any
): AxiosPromise => request({
  baseURL: apiBaseUrl.get('sys'),
  // baseURL: mockUrl,
  url: '/contacts_info/saveOrUpdate',
  method: 'POST',
  data: params,
});
/* 删除通讯录 */

export const deleteUscontactsInfo = (
  id:string
): AxiosPromise => request({
  baseURL: apiBaseUrl.get('sys'),
  // baseURL: mockUrl,
  url: '/contacts_info/delete',
  method: 'DELETE',
   params: {
    id,
  },
});