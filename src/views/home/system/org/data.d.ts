import { ResponseData, PaginationParams, PaginationResult } from '@/shims-vue.d';

export namespace ReqParams {
  export interface Save {
    addr: string;
    effective: 'Y' | 'N',
    id: string;
    orgName: string;
    parentId: string;
    shortName: string;
    showOrder: string;
  }

  export interface SearchOrgPage extends PaginationParams {
    addr: string;
    effective: 'Y' | 'N' | '';
    orgName: string;
    parentId: string;
  }
}

export namespace ResResult {
  interface OrgTreeItem {
    chkDisabled: boolean,
    id: string,
    name: string,
    isParent: boolean,
    checked: boolean,
    children: OrgTreeItem[],
  }

  export type GetOrgTree = ResponseData<OrgTreeItem[]>

  interface OrgItem {
    addr: string,
    effective: 'Y' | 'N',
    id: string,
    orgName: string,
    parentId: string,
    parentName: string,
    shortName: string,
    showOrder: string,
  }

  export type Get = ResponseData<OrgItem>

  export type Save = ResponseData<void>

  export type SearchOrgPage = ResponseData<PaginationResult<OrgItem>>

  export type Delete = ResponseData<void>
}

export interface OrgFormData {
  id: string,
  name: string,
  abbr: string,
  address: string,
  order: number,
  isAvailable: 'Y' | 'N',
  parentID: string,
}
