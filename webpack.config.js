const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const resolve = p => path.resolve(__dirname, p)

module.exports = {
  mode: 'production',
  devtool: false,
  entry: {
    build: './src/bin/build.ts',
    start: './src/bin/start.ts',
    dev: './src/bin/dev.ts'
  },
  output: {
    path: resolve('./dist'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      src: resolve('./src')
    }
  },
  // optimization: {
  //   minimizer: [
  //     new UglifyJsPlugin({
  //       uglifyOptions: {
  //         compress: {
  //           warnings: false
  //         },
  //         output: {
  //           comments: false
  //         }
  //       }
  //     })
  //   ]
  // },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'ts-loader']
      }
    ]
  },
  plugins: []
}
