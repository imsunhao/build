export default function(config, { resolve }) {
  return {
    entry: {
      app: ['./src/entry-client.ts'],
    },
    output: {
      globalObject: 'this',
    }
  }
}
