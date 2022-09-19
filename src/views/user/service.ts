import { AxiosPromise } from 'axios';
import request from '@/utils/request';
import apiBaseUrl from '@/config/apiBaseUrl';
import { ReqParams, ResResult } from './data.d';

export const login = (params: ReqParams.Login): AxiosPromise<ResResult.Login> => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/login/auth',
  // url: '/user/login',
  method: 'POST',
  data: params,
});

export const getUserMenu = (): AxiosPromise<ResResult.GetUserMenu> => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/login/getUserMenu',
  method: 'POST',
});

export const logout = (): AxiosPromise<ResResult.Logout> => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/login/logout',
  method: 'POST',
});

export const changePwd = (data: ReqParams.ChangePwd): AxiosPromise<ResResult.ChangePwd> => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/user/updatePasswbyAccount',
  method: 'POST',
  data,
});
