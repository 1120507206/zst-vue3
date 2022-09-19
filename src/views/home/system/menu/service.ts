import { AxiosPromise } from 'axios';
import apiBaseUrl from '@/config/apiBaseUrl';
import request from '@/utils/request';
import { ReqParams, ResResult } from './data.d';

/* 菜单树 */
export const getMenuTree = (): AxiosPromise<ResResult.GetMenuTree> => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/menu/getMenuTree',
  method: 'POST',
});

/* 获取单条菜单数据 */
export const get = (id: string): AxiosPromise<ResResult.Get> => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/menu/get',
  method: 'GET',
  params: {
    menuId: id,
  },
});

/* 保存修改 */
export const save = (params: ReqParams.Save): AxiosPromise<ResResult.Save> => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/menu/save',
  method: 'POST',
  data: params,
});

/* 查询数据分页 */
export const searchMenuPage = (
  params: ReqParams.SearchMenuPage,
): AxiosPromise<ResResult.SearchMenuPage> => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/menu/searchMenuPage',
  method: 'POST',
  data: params,
});

/* 删除菜单 */
export const deleteMenu = (id: string): AxiosPromise<ResResult.Delete> => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/menu/delete',
  method: 'POST',
  params: {
    menuId: id,
  },
});
