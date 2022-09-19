import { RuleItem } from 'async-validator';

//#region element-plus里面的没法直接引入，会报错，抄一份出来
export declare interface ValidateCallback {
  (result: string | Error | void): void;
}

export declare interface FormItemRule extends RuleItem {
  trigger?: string;
}

export declare interface FormRulesMap {
  [key: string]: FormItemRule | FormItemRule[];
}
//#endregion

//#region 图片相关
declare module '*.jpg' {
  const value: string;
  export default value;
}
declare module '*.png' {
  const value: string;
  export default value;
}
declare module '*.jpeg' {
  const value: string;
  export default value;
}
declare module '*.gif' {
  const value: string;
  export default value;
}
//#endregion

//#region 接口请求相关
export interface ResponseData<T> {
  status: number,
  success: boolean,
  message: string,
  obj: T,
}

export interface PaginationParams {
  /** 每页多少条数据 */
  pageSize: number,

  /** 当前第几页 */
  pageIndex: number,
}

export interface PaginationResult<T> extends PaginationParams {
  data: T[],

  total: number,
}
//#endregion

declare module '*.vue' {
  import type { DefineComponent } from 'vue';

  // eslint-disable-next-line @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module '@ckeditor/ckeditor5-vue';
declare module '@ckeditor/ckeditor5-build-decoupled-document';
