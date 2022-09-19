import { AxiosPromise } from 'axios';
import request from '@/utils/request';
import { ReqParams, ResResult } from './data.d';

export default {
  login: (params: ReqParams.Login): AxiosPromise<ResResult.Login> => request({
    url: '/login',
    method: 'POST',
    data: params,
  }),

  getUserMenu: (): AxiosPromise<ResResult.GetUserMenu> => request({
    url: '/login/getUserMenu',
    method: 'POST',
  }),

  logout: (): AxiosPromise<ResResult.Logout> => request({
    url: '/login/logout',
    method: 'POST',
  }),

  // /** 获取验证码 */
  // getPhoneCode: (phone: string): Promise<ResResult.GetPhoneCode> => request({
  //   url: '/api/jwt/getPhoneCode',
  //   method: 'GET',
  //   params: {
  //     phone,
  //   },
  // }),
};
