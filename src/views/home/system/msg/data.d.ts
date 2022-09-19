import { ResponseData, PaginationParams, PaginationResult } from '@/shims-vue.d';

export namespace ReqParams {
  export interface Save {
    id: string,
    appName: string,
    // assignee: string,
    bizName: string,
    formKey: string,
    formLocaltion: string,
    // launchDeptCode: string,
    // state: '0' | '1', // 处理状态：0待处理，1已处理
  }

  export interface SearchPage extends PaginationParams {
    appName: string,
    assignee: string,
    bizName: string,
    launchDeptCode?: string,
    state?: '0' | '1', // 处理状态：0待处理，1已处理
  }
}

export namespace ResResult {
  interface MsgItem {
    id: string,
    appName: string,
    assignee: string,
    bizName: string,
    formKey: string,
    formLocaltion: string,
    launchDeptCode: string,
    state: '0' | '1', // 处理状态：0待处理，1已处理
    createBy: string,
    createTime: string,
  }

  export type Save = ResponseData<void>

  export type SearchPage = ResponseData<PaginationResult<MsgItem>>

  export type Delete = ResponseData<void>
}

export interface MsgFormData {
  id: string,
  theme: string,
  business: string,
  key: string,
  href: string,
}
