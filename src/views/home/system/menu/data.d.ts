import { ResponseData, PaginationParams, PaginationResult } from '@/shims-vue.d';

export namespace ReqParams {
  export interface Save {
    id: string;
    effective: 'Y' | 'N',
    iconPath: string,
    menuDescription: string,
    menuName: string,
    menuOrder: string,
    menuType: string,
    menuUrl: string,
    parentId: string,
  }

  export interface SearchMenuPage extends PaginationParams {
    effective: 'Y' | 'N' | '';
    menuName: string,
    menuType: string,
    menuUrl: string,
    parentId: string,
  }
}

export namespace ResResult {
  export interface MenuTreeItem {
    chkDisabled: boolean,
    id: string,
    name: string,
    isParent: boolean,
    checked: boolean,
    children: MenuTreeItem[],
  }

  export type GetMenuTree = ResponseData<MenuTreeItem[]>

  interface MenuItem {
    addr: string,
    effective: 'Y' | 'N',
    id: string,
    iconPath: string,
    menuDescription: string,
    menuName: string,
    menuOrder: string,
    menuType: 'control' | 'form' | 'menu',
    menuUrl: string,
    parentId: string,
  }

  export type Get = ResponseData<MenuItem>

  export type Save = ResponseData<void>

  export type SearchMenuPage = ResponseData<PaginationResult<MenuItem>>

  export type Delete = ResponseData<void>
}

export interface MenuFormData {
  id: string,
  name: string,
  order: number,
  path: string,
  icon: string,
  type: 'control' | 'form' | 'menu',
  desc: string,
  parentID: string,
  isAvailable: 'Y' | 'N',
  isSubmenu: boolean,
}
