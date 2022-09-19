// import { ResponseData } from '../type';
//
// export namespace ReqParams {
//   export interface Login {
//     kaptcha?: string;
//     password: string;
//     remember?: string;
//     username: string;
//   }
//
//   export interface Register {
//     enterpriseCreditCode: string,
//     enterpriseName: string,
//     name: string,
//     idcard: string,
//     password: string,
//     password2: string,
//     email: string,
//     smsCode: string,
//     phone: string,
//   }
// }
//
// export namespace ResResult {
//   export interface UserInfo {
//     account: string,
//     companyId: number,
//     deptId: number,
//     deptName: string,
//     id: number,
//     mgrType: '0' | '1' | '2', // 管理员类型（0非管理员 1系统管理员 2二级管理员）
//     name: string,
//     oldCompanyId: number,
//     roleList: number[],
//     roleNames: string[],
//   }
//
//   export interface Menu {
//     code: string,
//     id: number,
//     ismenu: 0 | 1, // 1=菜单，0=按钮
//     name: string,
//     pcode: string,
//     status: 0 | 1, // 1=可用，0-禁用
//     url: string,
//   }
//
//   export type Login = ResponseData<{
//     info: UserInfo,
//     menuList: Menu[],
//   }>
//
//   export type Register = ResponseData<void>
//
//   export type GetPhoneCode = ResponseData<void>
//
//   export type Logout = ResponseData<void>
// }
