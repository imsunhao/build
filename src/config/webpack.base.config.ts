import merge from 'webpack-merge'
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import { VueLoaderPlugin } from 'vue-loader'
import consola from 'consola'
import { makeHappyPack } from 'src/utils'
import UglifyJsPlugin from 'uglifyjs-webpack-plugin'

import { ConfigOptions } from '@types'

export function getBaseConfig(options: ConfigOptions.options) {
  if (!(options.babelrc && options.webpack)) {
    consola.fatal(
      'getBaseConfig options.babelrc or options.webpack is undefined'
    )
    return process.exit(0)
  }
  const mode = options.webpack.mode || 'production'
  const isProd = mode === 'production'
  const base = options.webpack ? options.webpack.base || {} : {}

  const babelLoder = {
    loader: 'babel-loader',
    options: options.babelrc
  }

  return (merge as any)(
    {
      mode: isProd ? 'production' : 'development',
      context: options.rootDir,
      devtool: isProd ? false : '#cheap-module-source-map',
      output: {
        path: './dist',
        filename: '[chunkhash].js'
      },
      resolve: {
        extensions: ['.ts', '.js', '.vue', '.json']
      },
      module: {
        noParse: /es6-promise\.js$/,
        rules: [
          {
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
              compilerOptions: {
                preserveWhitespace: false
              }
            }
          },
          {
            test: /\.js$/,
            loader: 'happypack/loader?id=babel',
            exclude: /node_modules/
          },
          {
            test: /\.tsx?$/,
            loader: 'happypack/loader?id=ts',
            exclude: /node_modules/
          }
        ]
      },
      optimization: {
        minimizer: [
          new UglifyJsPlugin({
            uglifyOptions: {
              compress: {
                warnings: false,
              },
              output: {
                ecma: 5,
              },
              ecma: 8,
            },
            parallel: true
          })
        ]
      },
      performance: {
        maxEntrypointSize: 1024 * 300,
        maxAssetSize: 1024 * 300,
        hints: isProd ? 'warning' : false
      },
      plugins: (isProd ? [] : [new FriendlyErrorsPlugin()]).concat([
        new VueLoaderPlugin(),
        new ForkTsCheckerWebpackPlugin({
          vue: true, // 开启以检测 .vue 文件中的类型错误
          ignoreDiagnostics: [2339]
        }),
        makeHappyPack('ts', [
          {
            loader: 'ts-loader',
            options: {
              appendTsSuffixTo: [/\.vue$/],
              transpileOnly: true,
              happyPackMode: true
            }
          }
        ]),
        makeHappyPack('babel', [babelLoder])
      ])
    },
    base
  )
}
