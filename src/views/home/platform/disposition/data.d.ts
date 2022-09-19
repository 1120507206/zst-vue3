import { ResponseData, PaginationParams, PaginationResult } from '@/shims-vue.d';

export namespace ReqParams {
  export interface SearchPage extends PaginationParams {
    key?: string;
    name?: string;
  }
  export interface add {
    description: string;
    key: string;
    name: string;
  }
}

export namespace ResResult {
  interface Row {
    description: string;
    key: string;
    name: string;
    createTime: string;
    id: string;
    lastUpdateTime: string;
    version: number;
  }

  export type Rows = Row[];

  export type SearchPage = ResponseData<PaginationResult<Row>>;

  export type DictFormData = Rows;

  export type Delete = ResponseData<void>;

  export type Deploy = ResponseData<void>;

  export type Save = ResponseData<void>;
}
