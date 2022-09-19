/**
 * 自定义指令 权限验证
 * @author LiQingSong
 * 使用Demo：
 *      import permission from '@/directives/permission';
 *      import { defineComponent } from "vue";
 *      export default defineComponent({
 *          directives: {
 *              permission
 *          }
 *      })
 *      <a href="#" v-permission="{ route: '/user', auth: 'form' }">删除</a>
 *      <a href="#" v-permission="{ route: '/user', auth: ['form', 'button'] }">删除</a>
 */
import { find } from 'lodash-es';
import UserModel from '@/views/user/store';
// import { hasPermissionRouteRoles } from '@/utils/routes';
const permission = (el, binding) => {
  const { value: { route, auth } } = binding;
  if (auth) {
    // const userRoles = UserModel.state.currentUser.roles;
    // if (!hasPermissionRouteRoles(userRoles, value) && el.parentNode) {
    //   el.parentNode.removeChild(el);
    // }
    const pageItem = find(UserModel.state.authList, (item) => item.menuUrl === route);
    if (pageItem) {
      const authList = pageItem.children.filter((item) => item.menuType !== 'menu').map((item) => item.menuName);
      if (authList.length) {
        if (typeof auth === 'string') {
          return authList.includes(auth);
        }
        if (Array.isArray(auth) && auth.length) {
          return auth.some((role) => authList.includes(role));
        }
      }
      return true;
    }
    return true;
  }
  throw new Error('权限设置错误，示例: v-permission="{ route: \'/user\', auth: \'form\' }" 或 v-permission="{ route: \'/user\', auth: [\'form\', \'button\'] }"');
};
export default permission;
// # sourceMappingURL=index.js.map
