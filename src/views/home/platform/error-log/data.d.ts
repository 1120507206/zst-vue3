import { ResponseData, PaginationParams, PaginationResult } from '@/shims-vue.d';

export namespace ReqParams {
  export interface SearchPage extends PaginationParams {
    requestUrl: string,
    loginName: string,
    type: string,
  }
}

export namespace ResResult {
  export interface LogItem {
    id: string,
    requestUrl: string,
    loginName: string,
    type: string,
    note: string,
    parames: string,
  }

  export type SearchPage = ResponseData<PaginationResult<LogItem>>

  export type Delete = ResponseData<void>
}
