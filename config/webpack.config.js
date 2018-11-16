const nodeExternals = require('webpack-node-externals')

module.exports = {
  mode: 'production',
  devtool: false,
  target: 'node',
  // stats: 'errors-only',
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['.ts'],
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
