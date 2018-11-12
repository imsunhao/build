import merge from 'webpack-merge'
import { Configuration } from 'webpack'
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin'
import { VueLoaderPlugin } from 'vue-loader'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

const isProd = process.env.NODE_ENV === 'production'

import { ConfigOptions } from 'types/build'

export function getBaseConfig(options: ConfigOptions.options): Configuration {
  const base = options.webpack ? options.webpack.base || {} : {}
  return merge(
    {
      mode: isProd ? 'production' : 'development',
      devtool: isProd ? false : '#cheap-module-source-map',
      output: {
        path: './dist',
        publicPath: '/dist/',
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
            loader: 'babel-loader',
            exclude: /node_modules/
          },
          {
            test: /\.tsx?$/,
            exclude: /node_modules/,
            use: [
              'babel-loader',
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
