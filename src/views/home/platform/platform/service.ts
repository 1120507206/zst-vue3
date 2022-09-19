import type { AxiosPromise } from 'axios';
import apiBaseUrl from '@/config/apiBaseUrl';
import request from '@/utils/request';
import type { ReqParams, ResResult } from './data.d';

/* 查询数据分页 */
export const searchPage = (
  params: ReqParams.SearchPage,
): AxiosPromise<ResResult.SearchPage> => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/integrate/searchPage',
  method: 'POST',
  data: params,
});

/* 新增 */
export const addDoc = (params: ResResult.DictFormData): AxiosPromise<ResResult.Save> => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/integrate/save',
  method: 'POST',
  data: params,
});

/* 删除项 */
export const deleteDoc = (id: string): AxiosPromise<ResResult.Delete> => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/integrate/delete',
  method: 'POST',
  params: {
    id,
  },
});

interface IMenuLinkList {
  getRelateList: (platformId: string) => AxiosPromise<ResResult.MenuListRes>
  setLink: (params: ReqParams.setLink) => AxiosPromise<ResResult.MenuListRes>
  getMenuList: () => AxiosPromise<ResResult.MenuListRes>
}

export const MenuLinkList: IMenuLinkList = {
  /** 获取已关联菜单清单 */
  getRelateList: (platformId) => request({
    baseURL: apiBaseUrl.get('sys'),
    url: `/integrate/getRelateList?platformId=${platformId}`,
    method: 'POST',
  }),

  /** 菜单 */
  getMenuList: () => request({
    baseURL: apiBaseUrl.get('sys'),
    url: '/integrate/menuList',
    method: 'POST',
  }),

  /** 设置关联菜单 */
  setLink: (params) => request({
    baseURL: apiBaseUrl.get('sys'),
    url: '/integrate/menumanage',
    method: 'POST',
    data: params,
  }),
};
