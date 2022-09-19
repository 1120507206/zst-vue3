import { ResponseData, PaginationParams, PaginationResult } from '@/shims-vue.d';

export namespace ReqParams {
  export interface SearchPage extends PaginationParams {
    /** 类型 */
    type: string;
    ckey: string;
  }

  export interface FindDocByInstanceId {
    id: string;
    mode: 'edit' | 'view';
    type: 'desktop' | 'mobile';
  }
}

export namespace ResResult {
  export type Download = ResponseData<void>;

  interface Rows {
    /** id */
    id: string;

    /** 字典key */
    ckey: string;

    /** 创建人 */
    createBy?: string;
    /** 创建时间 */
    createTime?: string;
    /** 字典值 */
    cvalue: string;

    /** 备注 */
    remark?: string;

    /** 类型 */
    type?: string;

    /** 修改人 */
    updateBy?: number;

    /** 修改时间 */
    updateTime?: number;
  }

  export type SearchPage = ResponseData<PaginationResult<Rows>>;

  export type DictFormData = Rows;

  export type Delete = ResponseData<void>;
  export type Save = ResponseData<void>;
}
