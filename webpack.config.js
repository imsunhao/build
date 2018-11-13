const path = require('path')
const nodeExternals = require('webpack-node-externals')

const resolve = p => path.resolve(__dirname, p)

module.exports = {
  mode: 'production',
  devtool: false,
  target: 'node',
  entry: {
    build: './src/bin/build.ts',
    start: './src/bin/start.ts',
    dev: './src/bin/dev.ts'
  },
  output: {
    path: resolve('./dist'),
    filename: '[name].js',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      src: resolve('./src')
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
        use: [ 'ts-loader']
      }
    ]
  },
  plugins: []
}
