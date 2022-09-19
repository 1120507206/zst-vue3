import type { ResResult } from './data.d';

export const initialFormData: ResResult.Rows = {
  /** id */
  id: '',
  /** 公司名称 */
  platformName: '',
  contacts: '',
  code: '',
  email: '',
  status: 'Y',
  telephone: '',
};

/**
 * 是否合法手机
 */
export const isTelPhone = (str: string): boolean => /^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(str);

/**
 * 是否合法邮箱
 */
export const isEmail = (str: string): boolean => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(str);
