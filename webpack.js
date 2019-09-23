const path = require('path')
const nodeExternals = require('webpack-node-externals')

const resolve = p => path.resolve(__dirname, '.', p)

module.exports = {
  mode: 'development',
  devtool: false,
  target: 'node',
  entry: {
    index: resolve('./src/index.ts'),
    build: resolve('./src/bin/build.ts'),
    dev: resolve('./src/bin/dev.ts'),
    'bootstrap-storybook': resolve('./src/bin/bootstrap-storybook.ts'),
    'empty-module': resolve('./src/utils/empty-module.js')
  },
  output: {
    path: resolve('./dist'),
    filename: '[name].js',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      'src.config': resolve('./src/config'),
      'src-utils-compiler$': resolve('./src/utils/compiler.webpack'),
      'src-config-webpack.config.config$': resolve(
        './src/config/webpack.config.config'
      ),
      'src-config-webpack.dll.config$': resolve(
        './src/config/webpack.dll.config'
      ),
      'src-config-webpack.extensions.config$': resolve(
        './src/config/webpack.extensions.config'
      ),
      src: resolve('./src'),
      config: resolve('./config')
    }
  },
  externals: [
    nodeExternals({
      // whitelist: /\.css$/
      whitelist: [/\.css$/, /\?vue&type=style/]
    })
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: ['ts-loader']
      }
    ]
  },
  plugins: []
}
