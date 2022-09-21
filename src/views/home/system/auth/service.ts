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
/* 有效期列表 */
export const getValidDateList = (
  params:any
): AxiosPromise => request({
  baseURL: apiBaseUrl.get('sys'),
  // baseURL: mockUrl,
  url: '/user_identity/validDateList',
  method: 'GET',
   params
});
/* 修改或者添加数据 */
export const saveUserIdentity = (
  params:any
): AxiosPromise => request({
  baseURL: apiBaseUrl.get('sys'),
  // baseURL: mockUrl,
  url: '/user_identity/save',
  method: 'POST',
  data: params,
});
/* 删除标签数据 */

export const deleteUserIdentity = (
  id:string
): AxiosPromise => request({
  baseURL: apiBaseUrl.get('sys'),
  // baseURL: mockUrl,
  url: 'user_identity/delete',
  method: 'DELETE',
   params: {
    id,
  },
});
/* 查询标签分页数据 */
export const getSearchLabelPage = (
  params:any
): AxiosPromise => request({
  baseURL: apiBaseUrl.get('sys'),
  // baseURL: mockUrl,
  url: '/user_identity/searchLabelPage',
  method: 'POST',
  data: params,
});
/* 根据机构id或账号获取用户列表 */
export const getUserByAccountOrOrgId = (
  params:any
): AxiosPromise => request({
  baseURL: apiBaseUrl.get('sys'),
  // baseURL: mockUrl,
  url: '/user/findUserByAccountOrOrgId',
  method: 'GET',
   params,
});
/* 通过机构名称查询机构 */
export const getByName = (
  params:any
): AxiosPromise => request({
  baseURL: apiBaseUrl.get('sys'),
  // baseURL: mockUrl,
  url: 'org/getByName',
  method: 'GET',
   params,
});

/* 取消角色用户关联 */
// export const cancelUserAuth = (
//   params: ReqParams.CancelUserAuth,
// ): AxiosPromise<ResResult.CancelUserAuth> => request({
//   baseURL: apiBaseUrl.get('sys'),
//   url: '/role/cancelUserAuth',
//   method: 'POST',
//   data: params,
// });
