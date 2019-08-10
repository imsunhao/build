export default function(config, { resolve }) {
  return {
    output: {
      path: config.assetRoot,
      publicPath: config.outputPath,
    },
    resolve: {
      alias: {
        vue: resolve('node_modules/vue'),
        public: resolve('public'),
        src: resolve('src'),
        store$: resolve('src/store/index.ts')
      },
    },
    module: {
      rules: [
        {
          test: /worker\.js$/,
          loader: 'worker-loader',
          options: { inline: true },
        },
        {
          test: /.*\.wasm$/,
          // This is needed to make webpack NOT process wasm files.
          // See https://github.com/webpack/webpack/issues/6725
          type: 'javascript/auto',
          loader: 'file-loader',
          options: {
            name: '[name].[hash:5].[ext]',
          },
        },
      ],
    }
  }
}
