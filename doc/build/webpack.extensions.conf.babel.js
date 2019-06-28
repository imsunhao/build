export default function(config, { resolve }) {
  return {
    entry: {
      extensions: resolve('./server/index.ts'),
    },
    path: config.assetRoot
  }
}
