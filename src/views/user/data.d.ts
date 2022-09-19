import { ResponseData } from '@/shims-vue.d';

export namespace ReqParams {
  export interface Login {
    userName: string;
    userPass: string;
    platformCode: string;
  }

  export interface ChangePwd {
    userId: string;
    odlPass: string;
    userPass: string;
  }
}

export namespace ResResult {
  export type Login = ResponseData<{
    emailbox?: string,
    curOrgId: string,
    curOrgName: string,
    tk: string, // token
    userName: string,
    userIdentityId: string, // 相关接口需要调用用户ID的话传这个
    userId: string,
    account: string,
  }>

  interface MenuItem {
    effective: 'Y' | 'N', // 是否有效
    iconPath: string,
    id: string,
    menuDescription: string,
    menuName: string,
    menuOrder: string, // 需要转成number
    menuType: 'control' | 'form' | 'menu', // 菜单类型 control 控件，form 表单，menu 菜单，也是对应组件权限的标记
    menuUrl: string,
    parentId: string,
    children: MenuItem[],
  }

  export type GetUserMenu = ResponseData<MenuItem[]>

  export type Logout = ResponseData<void>

  export type ChangePwd = ResponseData<void>
}
