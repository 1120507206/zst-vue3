import { ResponseData, PaginationParams, PaginationResult } from '@/shims-vue.d';

export namespace ReqParams {
  export interface Save {
    id: string,
    account: string,
    contactNumber: string,
    effective: 'Y' | 'N',
    emailbox: string,
    gender: 'M' | 'F', // male or female
    iconPath: string,
    orgId: string,
    userName: string,
  }

  export interface SaveUserIdentity {
    id: string,
    orgId: string,
    effective: 'Y' | 'N',
    primaryIdentity: 'Y' | 'N',
    showOrder: string,
    userId: string,
    userIdentityName: string,
  }

  export interface SearchUserPage extends PaginationParams {
    orgId: string,
    searchKey: string,
  }

  export interface UpdatePasswordByAccount {
    userId: string,
    userPass: string,
  }
}

export namespace ResResult {
  interface User {
    id: string,
    account: string,
    contactNumber: string,
    effective: 'Y' | 'N',
    emailbox: string,
    gender: 'M' | 'F',
    iconPath: string,
    isDelete: 'Y' | 'N',
    userName: string,
  }

  export type Get = ResponseData<User>

  export type Save = ResponseData<void>

  export type SaveUserIdentity = ResponseData<void>

  export type UpdatePasswordByAccount = ResponseData<void>

  export type ResetPassword = ResponseData<void>

  export type SearchUserPage = ResponseData<PaginationResult<User>>

  interface UserIdentity {
    id: string,
    effective: 'Y' | 'N',
    orgId: string,
    orgName: string,
    primaryIdentity: 'Y' | 'N',
    showOrder: string,
    userId: string,
    userIdentityName: string,
  }

  export type SearchUserIdentityByUser = ResponseData<UserIdentity[]>

  export type Delete = ResponseData<void>
}

export interface UserFormData {
  id: string,
  account: string,
  name: string,
  gender: 'M' | 'F',
  mobile: string,
  email: string,
  icon: string,
}

export interface UserIdentityFormData {
  identity: string,
  isMain: 'Y' | 'N',
  isAvailable: 'Y' | 'N',
}

export interface UserIdentityData extends UserIdentityFormData {
  id: string,
  userId: string,
  orgId: string,
  orgName: string,
  order: number,
}
