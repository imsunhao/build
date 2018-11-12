import MiniCssExtractPlugin from 'mini-css-extract-plugin'
const isProd = process.env.NODE_ENV === 'production'
import { Configuration } from 'webpack'

import { ConfigOptions } from 'types/build'

function getSassLoader(sassOptions: ConfigOptions.sass = {}) {
  return {
    loader: 'sass-loader',
    options: {
      data: '',
      sourceMap: false,
      ...sassOptions
    }
  }
}

export function getStyle({ sass }: ConfigOptions.options = {}): Configuration {
  return {
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            isProd ? MiniCssExtractPlugin.loader : 'vue-style-loader',
            'css-loader',
            getSassLoader(sass)
          ]
        },
        {
          test: /\.css$/,
          use: [
            isProd ? MiniCssExtractPlugin.loader : 'vue-style-loader',
            'css-loader'
          ]
        }
      ]
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          styles: {
            name: 'styles',
            test: /\.css$/,
            chunks: 'all',
            enforce: true
          }
        }
      }
    },
    plugins: isProd
      ? [
          new MiniCssExtractPlugin({
            filename: '[contenthash].css'
          })
        ]
      : []
  }
}
