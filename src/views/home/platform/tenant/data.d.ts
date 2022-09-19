import { ResponseData, PaginationParams, PaginationResult } from '@/shims-vue.d';

export namespace ReqParams {
  export interface SearchPage extends PaginationParams {
    /** 类型 */
    companyName: string;
    contacts: string;
    telephone: string;
  }

  export interface FindDocByInstanceId {
    id: string;
    mode: 'edit' | 'view';
    type: 'desktop' | 'mobile';
  }

  export interface setAuthByMenu {
    teantId: string;
    authList: string[];
  }
}

export namespace ResResult {
  interface Rows {
    /** id */
    id: string;
    /** 公司名称 */
    companyName: string;
    /** 联系人 */
    contacts?: string;
    /** 地址 */
    addr?: string;
    createBy?: string;
    createTime?: string;
    email?: string;
    remark?: string;
    status: 'Y' | 'N';
    telephone?: string;
    updateBy?: string;
    updateTime?: string;
  }
  interface OrgItem {
    id: string;
    orgName: string;
    effective?: string;
  }
  interface TreeItem {
    id: string;
    isParent: boolean;
    name: string;
    checked?: boolean;
    children?: TreeItem[];
  }

  export type SearchPage = ResponseData<PaginationResult<Rows>>;

  export type DictFormData = Rows;

  export type Delete = ResponseData<void>;

  export type OrgListRes = ResponseData<OrgItem[]>;

  export type TreeItemRes = ResponseData<TreeItem[]>;

  export type Void = ResponseData<void>;
}
