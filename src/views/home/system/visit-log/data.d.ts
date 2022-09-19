import { ResponseData, PaginationParams, PaginationResult } from '@/shims-vue.d';

export namespace ReqParams {
  export interface SearchPage extends PaginationParams {
    operateUrl: string,
  }
}

export namespace ResResult {
  export interface LogItem {
    id: string,
    operateId: string,
    operateUrl: string,
    params: string,
  }

  export type SearchPage = ResponseData<PaginationResult<LogItem>>

  export type Delete = ResponseData<void>
}
