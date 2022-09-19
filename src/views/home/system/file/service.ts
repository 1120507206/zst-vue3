import axios, { AxiosPromise } from 'axios';
import apiBaseUrl from '@/config/apiBaseUrl';
import request from '@/utils/request';
import type { ReqParams, ResResult } from './data.d';

/* 文件下载 */
export const download = ({
  id,
  name,
}: {
  id: string,
  name: string,
}): Promise<void> => axios
  .get(`${process.env.VUE_APP_APIHOST}${apiBaseUrl.get('sys')}/common/download`, {
    params: {
      attaId: id,
    },
    responseType: 'blob',
  })
  .then((res) => {
    const link = document.createElement('a');
    const blob = new Blob([res.data], { type: 'text/plain' });
    link.style.display = 'none';
    link.href = URL.createObjectURL(blob);
    link.download = name; // 下载的文件名
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

/* 上传文件 */
export const upload = (): string => `${apiBaseUrl.get('sys')}/common/upload`;

/* 查询数据分页 */
export const searchPage = (
  params: ReqParams.SearchPage,
): AxiosPromise<ResResult.SearchPage> => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/common/searchPage',
  method: 'POST',
  data: params,
});

/* 返回示例附件 */
export const findByInstanceId = (id: string): AxiosPromise<ResResult.FindByInstanceId> => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/common/findByInstanceId',
  method: 'POST',
  params: {
    instanceId: id,
  },
});

/* 获取文档实例 */
export const findDocByInstanceId = (
  params: ReqParams.FindDocByInstanceId,
): AxiosPromise<ResResult.FindDocByInstanceId> => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/common/findDocByInstanceId',
  method: 'POST',
  params,
});

/* 删除文件 */
export const deleteFile = (id: string): AxiosPromise<ResResult.Delete> => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/common/delete',
  method: 'POST',
  params: {
    id,
  },
});
