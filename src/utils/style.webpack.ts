import MiniCssExtractPlugin from 'mini-css-extract-plugin'

import { ConfigOptions } from '@types'

function getSassLoader(sassOptions: ConfigOptions.options.sass = {}) {
  return {
    loader: 'sass-loader',
    options: {
      data: '',
      sourceMap: false,
      ...sassOptions
    }
  }
}

export function getStyle(
  { sass, webpack }: ConfigOptions.options = {},
  { isServer }: ConfigOptions.getStyleOptions
) {
  const isProd = webpack ? webpack.mode === 'production' : false
  return {
    module: {
      rules: isServer
        ? [
            {
              test: /\.scss$/,
              use: !isProd
                ? ['vue-style-loader', 'css-loader', getSassLoader(sass)]
                : ['null-loader']
            },
            {
              test: /\.css$/,
              use: !isProd
                ? ['vue-style-loader', 'css-loader']
                : ['null-loader']
            }
          ]
        : [
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
