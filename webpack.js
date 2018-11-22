const path = require('path')
const nodeExternals = require('webpack-node-externals')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const resolve = p => path.resolve(__dirname, '.', p)

module.exports = {
  mode: 'development',
  devtool: false,
  target: 'node',
  entry: {
    build: resolve('./src/bin/build.ts'),
    start: resolve('./src/bin/start.ts'),
    dev: resolve('./src/bin/dev.ts')
  },
  output: {
    path: resolve('./dist'),
    filename: '[name].js',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      src: resolve('./src'),
      config: resolve('./config')
    }
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
      }
    ]
  },
  plugins: []
}
