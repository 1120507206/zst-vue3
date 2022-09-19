/**
 * Mock Server
 * @author LiQingSong
 */
const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const chokidar = require('chokidar');
const requireContext = require('./require-context');

// 注册 mock 路由
function registerMockRoutes(mockDir, app) {
  let mockLastIndex = 0;
  let mockRoutesLength = 0;
  try {
    // 导入 /mock 下文件
    const context = requireContext(mockDir, false, /\.js$/);
    context.keys().forEach((fileName) => {
      // 获取内容
      const mocks = context(fileName);
      // eslint-disable-next-line guard-for-in,no-restricted-syntax
      for (const key in mocks) {
        const keys = key.replace(/(^\s*)|(\s*$)/g, '').split(' ');
        let ajaxType = 'get';
        let ajaxUrl = '';
        if (keys.length < 2) {
          ajaxUrl = keys[0];
        } else {
          ajaxType = keys[0].toLowerCase();
          ajaxUrl = keys[1];
          if (!['get', 'post', 'put', 'patch', 'delete', 'head', 'options'].includes(ajaxType)) {
            ajaxType = 'get';
          }
        }
        if (typeof mocks[key] === 'function') {
          app[ajaxType](ajaxUrl, mocks[key]);
          // eslint-disable-next-line no-underscore-dangle
          mockLastIndex = app._router.stack.length;
          mockRoutesLength += 1;
          // console.log(app._router.stack.length);
        }
      }
    });
  } catch (error) {
    console.log(error);
  }

  return {
    mockRoutesLength,
    mockStartIndex: mockLastIndex - mockRoutesLength,
  };
}

// 删除 mock 路由
function unRegisterMockRoutes(mockDir) {
  Object.keys(require.cache).forEach((i) => {
    if (i.includes(mockDir)) {
      delete require.cache[require.resolve(i)];
    }
  });
}

module.exports = (app) => {
  const mockDir = path.resolve('./mock');

  const mockRoutes = registerMockRoutes(mockDir, app);
  let { mockRoutesLength } = mockRoutes;
  let { mockStartIndex } = mockRoutes;

  // watch files, hot reload mock server
  chokidar.watch(mockDir, {
    ignoreInitial: true,
  }).on('all', (event, filePath) => {
    if (event === 'change' || event === 'add' || event === 'unlink') {
      // console.log(event, path);
      try {
        // remove mock routes stack
        // eslint-disable-next-line no-underscore-dangle
        app._router.stack.splice(mockStartIndex, mockRoutesLength);

        // clear routes cache
        unRegisterMockRoutes(mockDir);

        // rest routes
        const mockedRoutes = registerMockRoutes(mockDir, app);
        mockRoutesLength = mockedRoutes.mockRoutesLength;
        mockStartIndex = mockedRoutes.mockStartIndex;

        console.log(`\n > Mock Server hot reload success! changed  ${filePath}`);
      } catch (error) {
        console.log(error);
      }
    }
  });
};
