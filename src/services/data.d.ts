import { ResponseData } from '@/shims-vue.d';

export namespace ReqParams {
  export interface Login {
    userNmae: string;
    userPass: string;
  }

  export interface Dict{
    type: string;
  }
}

export namespace ResResult {
  export type Login = ResponseData<{
    email?: string,
    curOrgName?: string,
    tk: string, // token
    curOrgId: string,
    userName: string,
    userIdentityId: string,
    userId: string,
    account: string,
  }>

  export interface DictItem {
    desc: string;
    key: string;
    pkey: string;
    title: string;
  }

  export type Dict = ResponseData<DictItem[]>

  interface MenuItem {
    effective: 'Y',
    iconPath: string,
    id: string,
    menuDescription: string,
    menuName: string,
    menuOrder: string, // 需要转成number
    menuType: 'menu',
    menuUrl: string,
    parentId: string,
    children: MenuItem[],
  }

  export type GetUserMenu = ResponseData<MenuItem>

  export type Logout = ResponseData<void>

  export interface UserInfo{
    account: string;
    contactNumber: string;
    curOrgName: string;
    email: string;
    orgId: string;
    platformCode: string;
    userId: string;
    userIdentityId: string;
    userName: string;
  }
  export type AllUser = ResponseData<UserInfo[]>
}
