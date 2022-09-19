/* eslint-disable no-return-await */
// 正常系统应该考虑存localStorage的，然而本系统要求存cookie
// import localforage from 'localforage';
import Cookies from 'js-cookie';
import settings from '@/config/settings';
/**
 * 获取本地Token
 */
// export const getToken = async (): Promise<string | null> => await localforage.getItem(
//   settings.siteTokenKey,
// );
export const getToken = () => Cookies.get(settings.siteTokenKey);
/**
 * 设置存储本地Token
 */
// export const setToken = async (token: string): Promise<boolean> => {
//   try {
//     await localforage.setItem(settings.siteTokenKey, token);
//     return true;
//   } catch (error) {
//     return false;
//   }
// };
export const setToken = (token) => {
  Cookies.set(settings.siteTokenKey, token);
};
/**
 * 移除本地Token
 */
// export const removeToken = async (): Promise<boolean> => {
//   try {
//     await localforage.removeItem(settings.siteTokenKey);
//     return true;
//   } catch (error) {
//     return false;
//   }
// };
export const removeToken = () => Cookies.remove(settings.siteTokenKey);
// # sourceMappingURL=localToken.js.map
