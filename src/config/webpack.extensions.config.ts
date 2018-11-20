import { ConfigOptions } from '@types'
import merge from 'webpack-merge'
import nodeExternals from 'webpack-node-externals'
import webpack from 'webpack'
import consola from 'consola'

export function getExtensionsConfig(
  options: ConfigOptions.options
): webpack.Configuration {
  if (
    !(
      options.extensions &&
      options.extensions.entry &&
      options.extensions.path &&
      options.babelrc &&
      options.webpack &&
      options.webpack.mode
    )
  ) {
    consola.fatal(
      'getExtensionsConfig options.extensions.entry or options.babelrc is undefined'
    )
    return process.exit(0)
  }

  const babelLoder = {
    loader: 'babel-loader',
    options: options.babelrc
  }

  let resolve = {}
  if (options.webpack.server && options.webpack.server.resolve) {
    resolve = options.webpack.server.resolve
  }

  return (merge as any)(
    {
      mode: options.webpack.mode,
      devtool: false,
      target: 'node',
      // stats: 'errors-only',
      entry: options.extensions.entry,
      output: {
        path: options.extensions.path,
        filename: '[name].js',
        libraryTarget: 'commonjs2'
      },
      resolve: {
        extensions: ['.ts', '.js', '.vue', '.json']
      },
      externals: nodeExternals({
        // whitelist: /\.css$/
        whitelist: [/\.css$/, /\?vue&type=style/]
      }),
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            exclude: /node_modules/,
            use: ['ts-loader']
          },

          {
            test: /\.js$/,
            use: babelLoder,
            exclude: /node_modules/
          }
        ]
      }
    },
    { resolve },
    options.extensions.webpack
  )
}
