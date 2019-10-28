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
              use: 'null-loader'
            },
            {
              test: /\.css$/,
              use: 'null-loader'
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
              use: [isProd ? MiniCssExtractPlugin.loader : 'vue-style-loader', 'css-loader']
            }
          ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[contenthash].css'
      })
    ]
  }
}
