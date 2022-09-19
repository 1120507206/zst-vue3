import { ResponseData, PaginationParams, PaginationResult } from '@/shims-vue.d';

export namespace ReqParams {
  export interface SearchPage extends PaginationParams {
    instanceId?: string,
    name: string,
    type: string,
  }

  export interface FindDocByInstanceId {
    id: string,
    mode: 'edit' | 'view',
    type: 'desktop' | 'mobile',
  }
}

export namespace ResResult {
  export type Download = ResponseData<void>

  interface FileItem {
    id: string,
    instanceId: string,
    type: string,
    name: string,
    path: string,
    remark: string,
    size: number,
    createBy: string,
    createTime: string,
  }

  export type SearchPage = ResponseData<PaginationResult<FileItem>>

  export type FindByInstanceId = ResponseData<FileItem>

  interface Doc {
    id: string,
    callback: string,
    docType: string,
    downloadUrl: string,
    fileName: string,
    fileType: string,
    mode: 'edit' | 'view',
    type: 'desktop' | 'mobile',
    userId: string,
    userName: string,
  }

  export type FindDocByInstanceId = ResponseData<Doc>

  export type Delete = ResponseData<void>
}
