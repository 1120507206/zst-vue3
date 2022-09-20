import { ResponseData, PaginationParams, PaginationResult } from '@/shims-vue.d';

export namespace ReqParams {
  export interface CancelUserAuth {
    authList: string[],
    roleId: string,
  }

  export interface FindRoleNotRelateUser {
    orgId: string,
    roleId: string,
    searchKey?: string,
  }

  export interface RelateUserAuth {
    authList: string[],
    roleId: string,
  }

  export interface Save {
    id: string,
    roleName: string,
    describes: string,
    showOrder: string,
    effective: 'Y' | 'N',
  }

  export interface SaveMenuRole {
    authList: string[],
    roleId: string,
  }

  export interface SearchRolePage extends PaginationParams {
    effective: 'Y' | 'N' | '',
    roleName: string,
  }
}

export namespace ResResult {
  export interface TreeItem {
    chkDisabled: boolean,
    id: string,
    name: string,
    isParent: boolean,
    checked: boolean,
    children: TreeItem[],
  }

  export interface User {
    id: string,
    userId: string,
    userIdentityName: string,
    showOrder: string,
    effective: 'Y' | 'N',
    primaryIdentity: 'Y' | 'N',
    orgId: string,
    orgName: string,
  }

  export type CancelUserAuth = ResponseData<void>

  export type FindMenuAuthTree = ResponseData<TreeItem[]>

  export type FindRoleAndUser = ResponseData<User[]>

  export type FindRoleNotRelateUser = ResponseData<User[]>

  interface Role {
    id: string,
    describes: string,
    effective: 'Y' | 'N',
    roleName: string,
    showOrder: string,
  }

  export type Get = ResponseData<Role>

  export type RelateUserAuth = ResponseData<void>

  export type Save = ResponseData<void>

  export type SaveMenuRole = ResponseData<void>

  export type SearchRolePage = ResponseData<PaginationResult<Role>>
}

export interface AuthFormData {
  id: string,
  name: string,
  desc: string,
  order: number,
  isAvailable: 'Y' | 'N',
}
