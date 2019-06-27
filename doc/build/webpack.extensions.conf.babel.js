export default function(config, { resolve }) {
  return {
    entry: {
      extensions: resolve('./server/index.js'),
    },
    path: config.assetRoot
  }
}
