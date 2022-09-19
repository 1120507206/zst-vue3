/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * 自定义 request 网络请求工具,基于axios
 * @author LiQingSong
 */
import axios, { AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios';
import localforage from 'localforage';
import { ElNotification, ElLoading } from 'element-plus';
import router from '@/config/routes';
import settings from '@/config/settings';
import {
  getToken,
  // setToken,
} from '@/utils/localToken';
import { ResponseData } from '@/shims-vue.d';

declare global {
  interface Window {
    GlobalLoading: any;
  }
}

window.GlobalLoading = '';
let timer: any = 0;
// const customCodeMessage: { [key: number]: string } = {
//   10002: '当前用户登入信息已失效，请重新登入再操作', // 未登陆
// };
//
// const serverCodeMessage: { [key: number]: string } = {
//   200: '服务器成功返回请求的数据',
//   400: 'Bad Request',
//   401: 'Unauthorized',
//   403: 'Forbidden',
//   404: 'Not Found',
//   500: '服务器发生错误，请检查服务器(Internal Server Error)',
//   502: '网关错误(Bad Gateway)',
//   503: '服务不可用，服务器暂时过载或维护(Service Unavailable)',
//   504: '网关超时(Gateway Timeout)',
// };

/**
 * 异常处理程序
 */
const errorHandler = (error: any) => {
  clearTimeout(timer);
  if (window.GlobalLoading && window.GlobalLoading !== 'hideLoad') {
    window.GlobalLoading.close();
  }
  const { response, message } = error;
  if (message === 'CustomError') {
    // 自定义错误
    const { config, data } = response;
    const { url, baseURL } = config;
    const { status, message: errorMessage }: ResponseData<any> = data;
    const reqUrl = url.split('?')[0].replace(baseURL, '');
    const noVerifyBool = settings.ajaxResponseNoVerifyUrl.includes(reqUrl);
    if (!noVerifyBool) {
      ElNotification.error({
        title: '提示',
        message: errorMessage,
      });

      /*
       * 5002: 您的账号已经在其他的地方进行了登录,请求重新登陆
       * 5003: 您还没有进行登陆或者您的会话已经过期,请您重新登陆
       * 5004: 登录已过期,请您重新登陆
       * */
      if ([5002, 5003, 5004].includes(status)) {
        localforage.setItem('tabNav', JSON.stringify([]));
        router.replace('/user/login');
      }
    }
    // } else if (message === 'CancelToken') {
    //   // 取消请求 Token
    //   // eslint-disable-next-line no-console
    //   console.log(message);
  } else if (response && response.status) {
    // const errorText = serverCodeMessage[response.status] || response.statusText;
    const { data, request } = response;
    const { status, message: errorMessage }: ResponseData<any> = data;
    ElNotification.error({
      title: `请求错误 ${status}: ${request.responseURL}`,
      message: errorMessage,
    });
  } else if (!response) {
    ElNotification.error({
      title: '网络异常',
      message: '您的网络发生异常，无法连接服务器',
    });
  }

  return Promise.reject(error);
};

/**
 * 配置request请求时的默认参数
 */
const request = axios.create({
  baseURL: process.env.VUE_APP_APIHOST, // url = api url + request url
  withCredentials: true, // 当跨域请求时发送cookie
  timeout: 0, // 请求超时时间,5000(单位毫秒) / 0 不做限制
});

// 全局设置 - post请求头
// request.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

/**
 * 请求前
 * 请求拦截器
 */
request.interceptors.request.use(
  (config: AxiosRequestConfig & { cType?: boolean; hideLoad?: boolean }) => {
    if (!window.GlobalLoading) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        window.GlobalLoading = ElLoading.service({ fullscreen: true });
      }, 500);
    }
    // 如果设置了cType 说明是自定义 添加 Content-Type类型 为自定义post 做铺垫
    if (config.cType) {
      // eslint-disable-next-line no-param-reassign
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
    }

    // 自定义添加token header
    const headerToken = getToken();
    if (headerToken) {
      // eslint-disable-next-line no-param-reassign
      config.headers[settings.ajaxHeadersTokenKey] = headerToken;
    }

    return config;
  },
  /* error=> {} */ // 已在 export default catch
);

/**
 * 请求后
 * 响应拦截器
 */
request.interceptors.response.use(
  async (response: AxiosResponse) => {
    clearTimeout(timer);
    if (window.GlobalLoading && window.GlobalLoading !== 'hideLoad') {
      window.GlobalLoading.close();
    }
    // content-type: application/octet-stream
    const { headers, data, status: st } = response;
    if (/octet-stream/.test(headers['content-type']) && st === 200) {
      // ArrayBuffer 二进制数据
      return response;
      // return Promise.resolve({
      //   obj: {
      //     datatype: 'ArrayBuffer',
      //     headers,
      //     data,
      //   },
      //   message: '成功',
      //   success: true,
      //   status: 200,
      // });
    }
    const { status }: ResponseData<unknown> = data;
    // 自定义状态码验证
    if (status !== 200) {
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject({
        response,
        message: 'CustomError', // 别乱改，用于标记自定义错误用的
      });
    }

    // // 重置刷新token
    // if (token) {
    //   await setToken(token);
    // }

    return response;
  },
  /* error => {} */ // 已在 export default catch
);

/**
 * ajax 导出
 *
 * Method: get
 *     Request Headers
 *         无 - Content-Type
 *     Query String Parameters
 *         name: name
 *         age: age
 *
 * Method: post
 *     Request Headers
 *         Content-Type:application/json;charset=UTF-8
 *     Request Payload
 *         { name: name, age: age }
 *         Custom config parameters
 *             { cType: true }  Mandatory Settings Content-Type:application/json;charset=UTF-8
 * ......
 */
export default function (config: AxiosRequestConfig, hideLoad?: string): AxiosPromise {
  window.GlobalLoading = hideLoad;
  return request(config)
    .then((response: AxiosResponse) => response)
    .catch((error) => errorHandler(error));
}
