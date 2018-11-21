import nodeExternals from 'webpack-node-externals'
import webpack from 'webpack'

const babelLoder = {
  loader: 'babel-loader',
  options: {
    presets: [['latest-node', { target: 'current' }]]
  }
}

export function getConfigConfig({
  rootDir
}: {
  rootDir: string
}): webpack.Configuration {
  return {
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
  }
}
