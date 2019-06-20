export default function(config, { resolve }) {
  const path = resolve(`${config.assetRoot}/dll`)
  return {
    entry: {
      vue_lib: ['vue', 'vue-router', 'vuex', 'vuex-router-sync'],
      lib: ['axios'],
    },
    path,
    define: {
      'process.env.NODE_ENV': JSON.stringify(
        process.env.NODE_ENV || 'development'
      )
    },
    publicPath: `${config.outputPath}dll`,
    template: resolve('./src/index.template.html'),
    templateOutput: path,
    webpack: {
      resolve: {
        extensions: ['.ts', '.js', '.vue', '.json'],
      },
    },
  }
}
