const fs = require('fs')
const path = require('path')
const uniI18n = require('@dcloudio/uni-cli-i18n')

process.env.UNI_CLI_CONTEXT = path.resolve(__dirname, '../../../')

process.env.UNI_HBUILDERX_PLUGINS = process.env.UNI_HBUILDERX_PLUGINS || path.resolve(__dirname, '../../../../')

require('./module-alias')

module.exports = (api, options) => { // 仅处理 app-plus 相关逻辑
  if (process.env.UNI_PLATFORM !== 'app-plus') {
    return
  }

  if (
    !process.env.UNI_USING_V3 &&
    !process.env.UNI_USING_NATIVE &&
    !process.env.UNI_USING_V3_NATIVE
  ) {
    if (!fs.existsSync(path.resolve(process.env.UNI_HBUILDERX_PLUGINS, 'weapp-tools/lib/index.js'))) {
      console.error(uniI18n.__('pluginHbuilderx.plaseHXCompileAppPlatform'))
      process.exit(0)
    }
  }

  let plugins = []

  const output = {}
  const WebpackAppPlusPlugin = require('./packages/webpack-app-plus-plugin')

  plugins.push(new WebpackAppPlusPlugin())

  let userVueConfigPath = path.resolve(process.env.UNI_CLI_CONTEXT, 'vue.config.js')
  if (!fs.existsSync(userVueConfigPath)) {
    userVueConfigPath = path.resolve(process.env.UNI_INPUT_DIR, 'vue.config.js')
  }

  if (fs.existsSync(userVueConfigPath)) {
    userVueConfig = require(userVueConfigPath);
    userVueConfig.chainWebpack && api.chainWebpack(userVueConfig.chainWebpack);
    userVueConfig.configureWebpack && userVueConfig.configureWebpack.plugins && (plugins = plugins.concat(userVueConfig.configureWebpack.plugins));
  }

  api.configureWebpack(webpackConfig => {
    return {
      output,
      plugins
    }
  })
}
