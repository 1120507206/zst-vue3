import { ResponseData, PaginationParams, PaginationResult } from '@/shims-vue.d';

export namespace ReqParams {
  export interface ColumnDTO {
    // 字段描述
    columnComment: string;

    // 字段名称
    columnName: string;

    // 字段类型：1：String，2：Integer，3：Date，4：Double
    dataType: 1 | 2 | 3 | 4;

    // 是否搜索字段
    isSearch: boolean;

    // 字段长度
    length: string;

    // 是否列表显示
    listDisplay: boolean;

    // 是否禁用编辑
    disabled?: boolean;
  }
  export type ColumnsDTO = ColumnDTO[];

  export interface DTO{
    // 数据库表字段信息
    columnsDTO: ColumnsDTO;

    // 表单JSON
    formJson: string;

    // 主键
    id?: string;

    // 搜索Json
    seachJson: string;

    // 描述
    tableDesc: string;

    // 列表JSON,数据跟columnsDTO一致,前端显示内容根据listDisplay过滤得到
    tableJson: string;

    // 表名称
    tableName: string;
  }

  export interface CommonDel {
    objId: string,
    onlineId: string,
  }

  export interface CommonList {
    jsonString: Record<string, unknown>,
    onlineId: string,
    pageIndex: number,
    pageSize: number,
  }

  export interface CommonSave {
    id: string,
    onlineId: string,
    obj: Record<string, unknown>,
  }

  export interface Save {
    // 主键
    id: string;

    // 数据库表字段信息
    columnsDTO: ColumnDTO[];

    // 表单JSON
    formJson: string;

    // 搜索Json
    seachJson: string;

    // 描述
    tableDesc: string;

    // 列表JSON,数据跟columnsDTO一致,前端显示内容根据listDisplay过滤得到
    tableJson: string;

    // 表名称
    tableName: string;
  }

  export interface SearchPage extends PaginationParams {
    tableName: string,
  }
}

export namespace ResResult {
  export type CommonDel = ResponseData<void>

  export type CommonList = ResponseData<void>

  export type CommonSave = ResponseData<void>

  export type Get = ResponseData<{
    id: string,
    formJson: string,
    seachJson: string,
    tableDesc: string,
    tableJson: string,
    tableName: string,
  }>

  export type Save = ResponseData<void>

  export interface SearchPageRow {
    id: string,
    formJson: string,
    seachJson: string,
    tableDesc: string,
    tableJson: string,
    tableName: string,
  }

  export type SearchPage = ResponseData<PaginationResult<SearchPageRow>>
}
