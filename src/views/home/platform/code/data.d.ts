import { ResponseData, PaginationResult } from '@/shims-vue.d';

export namespace ReqParams {
  interface Columns {
    tableName?: string;
    tableSchema?: string;
  }

  interface ColList {
    columnComment: string;
    columnName: string;
    dataType: string;
    isSearch: boolean;
    length: string;
    id?: string;
  }

  interface column {
    columnName: string;
    tableName: string;
    dataType: string;
    isNullable: string;
    columnComment: string;
    ordinalPosition: string;
    columnKey: string;
  }

  interface Save {
    /** 业务名 */
    bizName: string;
    colList?: ColList[];
    /** 是否创建新表 */
    isCreate: boolean;
    /** 模块名称 */
    moduleName: string;
    /** 项目包名 */
    rootPackage: string;
    /** 搜索字段 */
    searchStr?: string;
    /** 表前缀 */
    tabPrefix?: string;
    /** 数据库名 */
    tabeSchema: string;
    tableSchema?: string;
    /** 表名 */
    tableName: string;
  }
}

export namespace ResResult {
  interface tableList {
    tableSchema: string;
    tableName: string;
    tableComment: string;
    children?: [];
  }

  interface arrayBufferRes {
    datatype: string;
    data: string;
  }

  export type TableListRes = ResponseData<tableList[]>;

  export type CreateCode = ResponseData<arrayBufferRes> & ResponseData<void>;

  export type ColumnListRes = ResponseData<column[]>;

  export type Void = ResponseData<void>;
}
