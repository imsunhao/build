import merge from 'webpack-merge'
import { Configuration } from 'webpack'
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin'
import { VueLoaderPlugin } from 'vue-loader'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

import { ConfigOptions } from '@types'

export function getBaseConfig(options: ConfigOptions.options) {
  const mode = options.webpack
    ? options.webpack.mode || 'production'
    : 'production'
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
        extensions: ['.ts', '.js', '.vue', '.json'],
        alias: {}
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
            use: babelLoder,
            exclude: /node_modules/
          },
          {
            test: /\.tsx?$/,
            exclude: /node_modules/,
            use: [
              babelLoder,
              {
                loader: 'ts-loader',
                options: { appendTsxSuffixTo: [/\.vue$/] }
              }
            ]
          }
        ]
      },
      performance: {
        maxEntrypointSize: 300000,
        hints: isProd ? 'warning' : false
      },
      plugins: isProd
        ? [
            new VueLoaderPlugin(),
            new MiniCssExtractPlugin({ filename: '[contenthash].css' })
          ]
        : [new VueLoaderPlugin(), new FriendlyErrorsPlugin()]
    },
    base
  )
}
