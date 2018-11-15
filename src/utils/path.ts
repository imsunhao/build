import { resolve, isAbsolute } from 'path'

/**
 * 转换 相对路径 为 以配置中根路径为底 的 绝对路径
 * @param rootDir 根路径
 */
export function createResolve(rootDir: string) {
  return function(path: string = '') {
    return isAbsolute(path) ? path : resolve(rootDir, path)
  }
}