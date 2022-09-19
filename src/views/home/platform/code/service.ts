import type { AxiosPromise } from 'axios';
import apiBaseUrl from '@/config/apiBaseUrl';
import request from '@/utils/request';
import type { ReqParams, ResResult } from './data.d';

/* 获取数据库表清单 */
export const getTableListBySchema = (tableSchema: string): AxiosPromise<ResResult.TableListRes> => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/codeGenerate/getTableListBySchema',
  method: 'GET',
  params: {
    tableSchema,
  },
});

/* 根据表名获取字段清单 */
export const getColumnsByTableName = (params: ReqParams.Columns): AxiosPromise<ResResult.ColumnListRes> => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/codeGenerate/getColumnsByTableName',
  method: 'GET',
  params: {
    tabeName: params.tableName,
    tableSchema: params.tableSchema,
  },
});

/* 生产代码 */
export const doCodeGenerator = (save: ReqParams.Save): AxiosPromise<ResResult.CreateCode> => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/codeGenerate/doCodeGenerator',
  method: 'POST',
  responseType: 'arraybuffer',
  data: {
    ...save,
  },
});
