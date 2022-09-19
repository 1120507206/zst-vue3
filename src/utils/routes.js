/**
 * Route utils
 * @author LiQingSong
 */
import { find, isNumber } from 'lodash-es';
import { isExternal } from './validate';
/**
 * 获取 route
 * @param pathname path
 * @param routesData routes
 */
export const getRouteItem = (pathname, routesData) => {
  let item = {
    title: '',
    path: '',
    redirect: '',
    roles: [],
  };
  for (let index = 0, len = routesData.length; index < len; index += 1) {
    const element = routesData[index];
    if (element.path === pathname) {
      item = element;
      break;
    }
    if (element.children) {
      item = getRouteItem(pathname, element.children);
      if (item.path !== '') {
        break;
      }
    }
  }
  return item;
};
/**
 * 根据 hidden 判断是否有数据子集
 * @param children RoutesDataItem[]
 */
export const hasChildRoute = (children) => {
  const showChildren = children.filter((item) => !item.hidden);
  return showChildren.length > 0;
};
/**
 * 根据路由 path 格式化 - 获取 父path
 * @param pathname path
 * @param separator 路由分割符- 默认 /
 */
export const formatRoutePathTheParents = (pathname, separator = '/') => {
  const arr = [];
  if (!pathname || pathname === '') {
    return arr;
  }
  const pathArr = pathname.split(separator);
  for (let index = 1, len = pathArr.length - 1; index < len; index += 1) {
    arr.push(pathArr.slice(0, index + 1)
      .join(separator));
  }
  return arr;
};
/**
 * 根据父path 设置当前项 path
 * @param pathname path
 * @param parentPath 父path - 默认 /
 * @param headStart 路由起始头 - 默认 /
 */
export const setRoutePathForParent = (pathname, parentPath = '/', headStart = '/') => {
  if (isExternal(pathname)) {
    return pathname;
  }
  return pathname.substr(0, headStart.length) === headStart
    ? pathname
    : `${parentPath}/${pathname}`;
};
/**
 * 根据路由 pathname 数组 - 返回对应的 route 数组
 * @param pathname path[]
 * @param routesData routes
 */
export const getPathsTheRoutes = (pathname, routesData) => {
  const routeItem = [];
  for (let index = 0, len = pathname.length; index < len; index += 1) {
    const element = pathname[index];
    const item = getRouteItem(element, routesData);
    if (item.path !== '') {
      routeItem.push(item);
    }
  }
  return routeItem;
};
/**
 * 获取面包屑对应的 route 数组
 * @param route route 当前routeItem
 * @param pathname path[]
 * @param routesData routes
 */
export const getBreadcrumbRoutes = (route, pathname, routesData) => {
  if (!route.breadcrumb) {
    const routePaths = getPathsTheRoutes(pathname, routesData);
    return route.breadcrumb === false ? routePaths : [...routePaths, route];
  }
  return route.breadcrumb;
};
/**
 * 获取当前路由选中的侧边栏菜单path
 * @param route route
 */
export const getSelectLeftMenuPath = (route) => route.selectLeftMenu || route.path;
/**
 * 获取当前路由对应的顶部菜单path
 * @param route route
 */
export const getRouteBelongTopMenu = (route) => {
  if (route.belongTopMenu) {
    return route.belongTopMenu;
  }
  return `/${route.path.split('/')[1]}`;
};
/**
 * 格式化返回 vue 路由, 主要处理特殊情况
 * @param rawAuthList 未经加工的后端返回权限信息
 * @param routesData routes
 * @param parentPath 父path - 默认 /
 * @param headStart 路由起始头 - 默认 /
 */
export const vueRoutes = (rawAuthList, routesData, parentPath = '/', headStart = '/') => routesData.map((item) => {
  const { children, ...other } = item;
  const authItem = find(rawAuthList, (rawAuthItem) => rawAuthItem.menuUrl === item.path);
  const itemChildren = children || [];
  console.log(rawAuthList, item, authItem);
  const newItem = {
    ...other,
    // hidden: authItem ? ((authItem.effective === 'N') || other.hidden) : other.hidden, // 调试菜单功能就放开一下吧，可以看到所有hidden=false的菜单
    hidden: authItem ? ((authItem.effective === 'N') || other.hidden) : true,
    title: authItem ? authItem.menuName : other.title,
    order: authItem ? Number(authItem.menuOrder) : 9999,
    authList: authItem ? authItem.children.filter((authChild) => authChild.menuType !== 'menu') : [],
  };
  newItem.path = setRoutePathForParent(newItem.path, parentPath, headStart);
  if (item.children) {
    newItem.children = [
      ...vueRoutes(rawAuthList, itemChildren, newItem.path, headStart),
    ];
  }
  return newItem;
}).sort((a, b) => {
  const orderA = isNumber(a.order) ? a.order : 9999;
  const orderB = isNumber(b.order) ? b.order : 9999;
  return orderA === orderB ? 1 : orderA - orderB; // 返回0不能保证顺序一致
});
/**
 * 根据 自定义传入权限名 判断当前用户是否有权限
 * @param userRoles 用户的权限
 * @param roles 自定义权限名
 */
export const hasPermissionRouteRoles = (userRoles, roles) => {
  if (userRoles.includes('admin')) {
    return true;
  }
  if (typeof roles === 'undefined') {
    return true;
  }
  if (typeof roles === 'string') {
    return userRoles.includes(roles);
  }
  if (roles instanceof Array && roles.length > 0) {
    return roles.some((role) => userRoles.includes(role));
  }
  return false;
};
/**
 * 根据 route.roles 判断当前用户是否有权限
 * @param roles 用户的权限
 * @param route 当前路由
 */
export const hasPermission = (roles, route) => {
  if (roles.includes('admin')) {
    return true;
  }
  if (route.roles) {
    return route.roles.some((role) => roles.includes(role));
    // return roles.some(role => route.roles?.includes(role));
  }
  return true;
};
/**
 * 根据用户权限 获取 对应权限菜单
 * @param roles 用户的权限
 * @param routes 框架对应路由
 */
export const getPermissionMenuData = (roles, routes) => {
  const menu = [];
  for (let index = 0, len = routes.length; index < len; index += 1) {
    const element = { ...routes[index] };
    if (hasPermission(roles, element)) {
      if (element.children) {
        element.children = getPermissionMenuData(roles, element.children);
      }
      menu.push(element);
    }
  }
  return menu;
};
// # sourceMappingURL=routes.js.map
