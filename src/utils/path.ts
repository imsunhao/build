// import { resolve, isAbsolute } from 'path'
// import { Configuration, Entry } from 'webpack'

// export function createResolve(rootDir: string) {
//   return function(path: string = '') {
//     return isAbsolute(path) ? path : resolve(rootDir, path)
//   }
// }
/**
 * 转换 相对路径为正确的路径
 */
// export function checkPath(config: Configuration, rootDir: string) {
//   const resolve = createResolve(rootDir)
//   if (config.output) {
//     config.output.path = resolve(config.output.path)
//   }
//   if (config.entry) {
//     if (typeof config.entry === 'string') config.entry = resolve(config.entry)
//     else {
//       const entry: Entry = config.entry as any
//       for (const index in entry) {
//         entry[index] = resolve(entry[index] as string)
//       }
//     }
//   }
//   return config
// }