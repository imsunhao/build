import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
export default function(config, { resolve }) {
  return {
    entry: {
      app: ['./src/entry-client.ts'],
    },
    output: {
      globalObject: 'this',
    },
    plugins: [
      // new BundleAnalyzerPlugin()
    ]
  }
}
