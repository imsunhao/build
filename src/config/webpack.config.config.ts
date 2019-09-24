import nodeExternals from 'webpack-node-externals'
import webpack from 'webpack'
import merge from 'webpack-merge'
import { getCommonConfig } from './webpack.common.config'

export const babelLoder = {
  loader: 'babel-loader',
  options: {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            node: 'current'
          },
          corejs: { version: 3 }
        }
      ]
    ]
  }
}

export function getConfigConfig({
  rootDir
}: {
  rootDir: string
}): webpack.Configuration {
  return (merge as any)(getCommonConfig('development'), {
    name: 'config',
    devtool: false,
    target: 'node',
    context: rootDir,
    output: {
      filename: '[name].js',
      libraryTarget: 'commonjs2'
    },
    resolve: {
      extensions: ['.ts', '.js', '.json']
    },
    externals: nodeExternals(),
    module: {
      rules: [
        {
          test: /\.js$/,
          use: babelLoder,
          exclude: /node_modules/
        },
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [babelLoder, 'ts-loader']
        }
      ]
    },
    plugins: []
  })
}
