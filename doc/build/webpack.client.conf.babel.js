import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
export default function(config, { resolve }) {
  return {
    entry: {
      app: ['./src/entry-client.ts'],
    },
    output: {
      globalObject: 'this',
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          utils: {
            name: 'utils',
            test: /src[\\/]utils[\\/]/,
            chunks: 'all',
            enforce: true
          }
        }
      }
    },
    plugins: [
      new BundleAnalyzerPlugin()
    ]
  }
}
