import merge from 'webpack-merge'
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import { VueLoaderPlugin } from 'vue-loader'
import consola from 'consola'
import { makeHappyPack } from 'src/utils'
import UglifyJsPlugin from 'uglifyjs-webpack-plugin'
import Webpackbar from 'webpackbar'
import { getCommonConfig } from './webpack.common.config'

import { ConfigOptions } from '@types'

export function getBaseConfig(options: ConfigOptions.options) {
  if (!(options.babelrc && options.webpack)) {
    consola.fatal(
      'getBaseConfig options.babelrc or options.webpack is undefined'
    )
    return process.exit(1)
  }
  const mode = options.webpack.mode || 'production'
  const isProd = mode === 'production'
  const base = options.webpack ? options.webpack.base || {} : {}
  const tsLoader: any = {
    loader: 'ts-loader',
    options: {
      appendTsSuffixTo: [/\.vue$/],
      transpileOnly: true,
      happyPackMode: true,
    }
  }
  if (options.tsconfig) {
    tsLoader.options.context = options.rootDir
    tsLoader.options.configFile = options.tsconfig
  }
  // consola.fatal(tsLoader)

  const babelLoder = {
    loader: 'babel-loader',
    options: options.babelrc
  }

  return (merge as any)(
    getCommonConfig(mode),
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
                warnings: false
              },
              output: {
                ecma: 5
              },
              ecma: 8
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
      plugins: (isProd
        ? []
        : [
            new Webpackbar(),
            new FriendlyErrorsPlugin(),
            new ForkTsCheckerWebpackPlugin({
              vue: true, // 开启以检测 .vue 文件中的类型错误
              ignoreDiagnostics: [2339]
            })
          ]
      ).concat([
        new VueLoaderPlugin(),
        makeHappyPack('ts', [tsLoader]),
        makeHappyPack('babel', [babelLoder])
      ])
    },
    base
  )
}
