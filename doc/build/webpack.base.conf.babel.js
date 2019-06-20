export default function(config, { resolve }) {
  return {
    output: {
      path: config.assetRoot,
      publicPath: config.outputPath,
    },
    resolve: {
      alias: {
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
      ],
    },
  }
}
