/**
 * 自动导入 Store
 * @author LiQingSong
 */
export function importAllStore() {
  const modules = {};
  try {
    // 导入 @/views 下文件，包含子目录，文件名为：store.ts
    const viewsRequireContext = require.context('../views', true, /[/\\]store\.ts$/);
    viewsRequireContext.keys().forEach((fileName) => {
      // 获取内容
      const modulesContent = viewsRequireContext(fileName);
      if (modulesContent.default) {
        const { name, ...module } = modulesContent.default;
        // 获取 PascalCase 命名
        const modulesName = name || fileName.replace(/^\.\/(.*)\.\w+$/, '$1');
        modules[modulesName] = { ...module };
      }
    });
    // 导入 @/store 下文件
    const requireContext = require.context('../store', false, /\.ts$/);
    requireContext.keys().forEach((fileName) => {
      // 获取内容
      const modulesContent = requireContext(fileName);
      if (modulesContent.default) {
        const { name, ...module } = modulesContent.default;
        // 获取 PascalCase 命名
        const modulesName = name || fileName.replace(/^\.\/(.*)\.\w+$/, '$1');
        modules[modulesName] = { ...module };
      }
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
  return modules;
}
// # sourceMappingURL=store.js.map
