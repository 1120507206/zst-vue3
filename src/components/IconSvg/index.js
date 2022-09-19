import iconsvg from './index.vue';
/**
 * 自动导入 @/assets/iconsvg 下svg文件
 * @author LiQingSong
 */
export function importAllSvg() {
  try {
    const requireContext = require.context('../../assets/iconsvg', false, /\.svg$/);
    requireContext.keys().forEach(requireContext);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
}
export default iconsvg;
// # sourceMappingURL=index.js.map
