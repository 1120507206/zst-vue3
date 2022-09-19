import { AxiosPromise } from 'axios';
import apiBaseUrl from '@/config/apiBaseUrl';
import request from '@/utils/request';
import { ReqParams, ResResult } from './data.d';

/* 取消角色用户关联 */
export const cancelUserAuth = (
  params: ReqParams.CancelUserAuth,
): AxiosPromise<ResResult.CancelUserAuth> => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/role/cancelUserAuth',
  method: 'POST',
  data: params,
});

/* 查询当前角色关联的菜单 */
export const findMenuAuthTree = (id: string): AxiosPromise<ResResult.FindMenuAuthTree> => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/role/findMenuAuthTree',
  method: 'POST',
  params: {
    roleId: id,
  },
});

/* 查询当前角色关联的用户 */
export const findRoleAndUser = (id: string): AxiosPromise<ResResult.FindRoleAndUser> => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/role/findRoleAndUser',
  method: 'POST',
  params: {
    roleId: id,
  },
});

/* 查询当前角色未关联的用户 */
export const findRoleNotRelateUser = (
  params: ReqParams.FindRoleNotRelateUser,
): AxiosPromise<ResResult.FindRoleNotRelateUser> => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/role/findRoleNotRelateUser',
  method: 'POST',
  data: params,
});

/* 获取单条角色数据 */
export const get = (id: string): AxiosPromise<ResResult.Get> => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/role/get',
  method: 'GET',
  params: {
    orgId: id,
  },
});

/* 角色关联用户 */
export const relateUserAuth = (
  params: ReqParams.RelateUserAuth,
): AxiosPromise<ResResult.RelateUserAuth> => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/role/relateUserAuth',
  method: 'POST',
  data: params,
});

/* 保存用户信息 */
export const save = (params: ReqParams.Save): AxiosPromise<ResResult.Save> => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/role/save',
  method: 'POST',
  data: params,
});

/* 关联菜单角色 */
export const saveMenuRole = (
  params: ReqParams.SaveMenuRole,
): AxiosPromise<ResResult.SaveMenuRole> => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/role/saveMenuRole',
  method: 'POST',
  data: params,
});

/* 查询数据分页 */
export const searchRolePage = (
  params: ReqParams.SearchRolePage,
): AxiosPromise<ResResult.SearchRolePage> => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/role/searchRolePage',
  method: 'POST',
  data: params,
});
