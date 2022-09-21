/* eslint-disable no-param-reassign,@typescript-eslint/no-var-requires */
const bodyParser = require('body-parser');
const path = require('path');
const mockServer = require('./src/utils/mock/server');

const { NODE_ENV, VUE_APP_PORT, VUE_APP_MOCK } = process.env;
module.exports = {
  outputDir: 'dist',
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  productionSourceMap: false,
  // 修改webpack的配置
  configureWebpack: {
    module: {
      // 保证新版vueuse可以正常编译
      rules: [{
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      }],
    },

    // 不需要打包的插件
    externals: {
      // 'vue': 'Vue',
      // 'vue-router': 'VueRouter',
      // 'element-ui': 'ELEMENT'
    },
  },
  chainWebpack(config) {
    // 内置的 svg Rule 添加 exclude
    config.module
      .rule('svg')
      .exclude.add(/iconsvg/)
      .end();

    // 添加 svg-sprite-loader Rule
    config.module
      .rule('svg-sprite-loader')
      .test(/.svg$/)
      .include.add(/iconsvg/)
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader');

    // 添加 svgo Rule
    config.module
      .rule('svgo')
      .test(/.svg$/)
      .include.add(/iconsvg/)
      .end()
      .use('svgo-loader')
      .loader('svgo-loader')
      .options({
        // externalConfig 配置特殊不是相对路径，起始路径是根目录
        externalConfig: './src/assets/iconsvg/svgo.yml',
      });
  },
  css: {
    sourceMap: process.env.NODE_ENV === 'development',
    // loaderOptions: {
    //   less: {
    //     javascriptEnabled: true,
    //   },
    // },
  },
  lintOnSave: false,
  devServer: {

    port: VUE_APP_PORT || 10022,
    // compress: true,
    // 配置反向代理
    proxy: {
      '/': {
        // target: 'http://192.168.2.216:10026',
        // target: 'http://192.168.1.52',
        // target: 'http://118.195.149.161:1622',
        target: 'http://192.168.3.54:1622',//开发人员服务器-何裕彤
        // target: 'http://192.168.3.152:1622',//开发人员服务器-陈嘉坤
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '',
          // '^/api/sys': '',
        },
        onProxyRes(proxyRes) {
          // 解决开发环境下cookie丢失，接口在后盾那边可以正常请求，前端请求错误的情况；生产环境一般无此问题
          // https://juejin.cn/post/6844903570488180749
          const cookies = proxyRes.headers['set-cookie'];
          const cookieRegex = /Path=\/frontend/i;
          // 修改cookie Path
          if (cookies) {
            const newCookie = cookies.map((cookie) => {
              if (cookieRegex.test(cookie)) {
                return cookie.replace(cookieRegex, 'Path=/');
              }
              return cookie;
            });
            // 修改cookie path
            delete proxyRes.headers['set-cookie'];
            proxyRes.headers['set-cookie'] = newCookie;
          }
        },
      },
    },

    // mock server配置
    before(app) {
      if (NODE_ENV === 'development' && VUE_APP_MOCK === 'true') {
        // parse app.body
        // https://expressjs.com/en/4x/api.html#req.body
        // create application/json parser
        app.use(bodyParser.json());
        // create application/x-www-form-urlencoded parser
        app.use(bodyParser.urlencoded({ extended: false }));
        mockServer(app);
      }
    },
  },
};
