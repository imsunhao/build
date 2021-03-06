const path = require('path')
const _ = require('lodash')
const config = _.cloneDeep(require('../../webpack'))
const resolve = p => path.resolve(__dirname, '../../', p)
const CopyPlugin = require('copy-webpack-plugin')
const nodeExternals = require('webpack-node-externals')

// config.mode = 'production'
const emptyModule = config.entry['empty-module']

config.entry = {
  start: resolve('./src/bin/start.ts')
}

const alias = {
  'src.config': emptyModule,
  'src-config-webpack.config.config$': emptyModule,
  'src-config-webpack.dll.config$': emptyModule,
  'src-config-webpack.extensions.config$': emptyModule,
  'src-utils-compiler$': emptyModule,
  chokidar: emptyModule
  // 'friendly-errors-webpack-plugin': emptyModule,
  // 'friendly-errors-webpack-plugin': emptyModule,
  // 'fork-ts-checker-webpack-plugin': emptyModule,
  // 'vue-loader': emptyModule,
  // 'uglifyjs-webpack-plugin': emptyModule,
  // 'mini-css-extract-plugin': emptyModule,
  // 'optimize-css-assets-webpack-plugin': emptyModule,
  // 'html-webpack-plugin': emptyModule,
  // 'webpack-node-externals': emptyModule,
}

// process.exit(0)
config.output.path = resolve('./packages/start/dist')
const plugins = [
  new CopyPlugin([
    { from: resolve('./bin/utils.js'), to: resolve('./packages/start/bin') }
  ])
]

if (config.plugins) {
  config.plugins.push(...plugins)
} else {
  config.plugins = plugins
}

if (config.resolve && config.resolve.alias) {
  Object.assign(config.resolve.alias, alias)
} else if (config.resolve) {
  config.resolve.alias = alias
} else {
  config.resolve = {
    alias
  }
}

config.externals = [
  nodeExternals({
    whitelist: [/\.css$/, /\?vue&type=style/, 'chokidar']
  })
]

// console.dir(config, {
//   depth: null
// })

// process.exit(0)

module.exports = config
