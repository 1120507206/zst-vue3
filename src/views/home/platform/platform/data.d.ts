import { ResponseData, PaginationParams, PaginationResult } from '@/shims-vue.d';

export namespace ReqParams {
  export interface SearchPage extends PaginationParams {
    /** 类型 */
    code?: string;
    platformName?: string;
  }

  export interface FindDocByInstanceId {
    id: string;
    mode: 'edit' | 'view';
    type: 'desktop' | 'mobile';
  }
  export interface setLink {
    platformId: string;
    authList: string[];
  }
}

export namespace ResResult {
  interface Rows {
    /** id */
    id: string;
    /** 公司名称 */
    platformName: string;
    /** 联系人 */
    contacts: string;
    code: string;
    createBy?: string;
    createTime?: string;
    email?: string;
    status: string;
    telephone?: string;
    updateBy?: string;
    updateTime?: string;
  }

  interface menuList {
    id: string;
    parentId: string;
    menuName: string;
    menuDescription?: string;
    menuUrl?: string;
    iconPath?: string;
    menuOrder?: string;
    menuType?: string;
    effective?: string;
    children?: menuList[];
    checked?: boolean;
  }

  export type SearchPage = ResponseData<PaginationResult<Rows>>;

  export type MenuList = ResponseData<menuList[]>;

  export type MenuListRes = ResponseData<menuList[]>;

  export type DictFormData = Rows;

  export type Delete = ResponseData<void>;

  export type Save = ResponseData<void>;
}
