import { ResponseData, PaginationParams, PaginationResult } from '@/shims-vue.d';

export namespace ReqParams {
  export interface SearchPage extends PaginationParams {
    account: string,
    logType: string,
  }
}

export namespace ResResult {
  export interface LogItem {
    id: string,
    account: string,
    signInIp: string,
    logType: string,
    remark: string,
  }

  export type SearchPage = ResponseData<PaginationResult<LogItem>>

  export type Delete = ResponseData<void>
}
