import type { AxiosPromise } from 'axios';
import apiBaseUrl from '@/config/apiBaseUrl';
import request from '@/utils/request';
import type { ReqParams, ResResult } from './data.d';

/* 获取单个用户数据 */
export const get = (id: string): AxiosPromise<ResResult.Get> => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/user/get',
  method: 'GET',
  params: {
    id,
  },
});

/* 保存修改 */
export const save = (params: ReqParams.Save): AxiosPromise<ResResult.Save> => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/user/save',
  method: 'POST',
  data: params,
});

/* 保存用户身份 */
export const saveUserIdentity = (
  params: ReqParams.SaveUserIdentity,
): AxiosPromise<ResResult.SaveUserIdentity> => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/user/saveUserIdentity',
  method: 'POST',
  data: params,
});

/* 修改用户密码 */
export const updatePasswordByAccount = (
  params: ReqParams.UpdatePasswordByAccount,
): AxiosPromise<ResResult.UpdatePasswordByAccount> => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/user/updatePasswbyAccount',
  method: 'POST',
  data: params,
});

/* 重置用户密码 */
export const resetPassword = (id: string): AxiosPromise<ResResult.ResetPassword> => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/user/resetPassword',
  method: 'GET',
  params: {
    id,
  },
});

/* 查询数据分页1 */
export const searchUserOrgPage = (
  params: ReqParams.SearchUserPage,
): AxiosPromise<ResResult.SearchUserPage> => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/user/searchUserOrgPage',
  method: 'POST',
  data: params,
});
/* 查询数据分页 */
export const searchUserPage = (
  params: ReqParams.SearchUserPage,
): AxiosPromise<ResResult.SearchUserPage> => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/user/searchUserPage',
  method: 'POST',
  data: params,
});

/* 获取用户所有身份数据 */
export const searchUserIdentityByUser = (
  id: string,
): AxiosPromise<ResResult.SearchUserIdentityByUser> => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/user/searchUserIdentityByUser',
  method: 'POST',
  params: {
    userId: id,
  },
});

/* 删除用户 */
export const deleteUser = (id: string): AxiosPromise<ResResult.Delete> => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/user/delete',
  method: 'POST',
  params: {
    userId: id,
  },
});
