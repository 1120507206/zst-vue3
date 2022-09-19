import { AxiosPromise } from 'axios';
import request from '@/utils/request';
import apiBaseUrl from '@/config/apiBaseUrl';
import { ReqParams, ResResult } from './data.d';

export const getDict = (params: ReqParams.Dict): AxiosPromise<ResResult.Dict> => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/constant/selectList',
  method: 'POST',
  params,
});

// 获取用户列表
export const getAllUser = (): AxiosPromise<ResResult.AllUser> => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/user/getAllUserInfo',
  method: 'POST',
});

// export default {
//   getDict,
// };
