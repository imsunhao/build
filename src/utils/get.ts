
import { utils } from "@types";
type BaseGetOptions = utils.Get.BaseGetOptions

/**
 * 安全获取对象的值 - 不报错
 * * 可能为 undefined
 * @param obj 读取对象
 * @param args 读取路径
 */
export function getValue<T extends object> (obj: T): T
export function getValue<T extends object, K1 extends keyof T> (obj: T, k1: K1): T[K1]
export function getValue<T extends object, K1 extends keyof T, K2 extends keyof T[K1]> (obj: T, k1: K1, k2: K2): T[K1][K2]
export function getValue<T extends object, K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2]> (obj: T, k1: K1, k2: K2, k3: K3): T[K1][K2][K3]
export function getValue(obj: any, ...args: string[]) {
  return obj == null ? undefined : baseGet(obj, args)
}

/**
 * 安全获取对象的值 - 会报错
 * * 必须使用 try - catch
 * @param obj 读取对象
 * @param options 配置参数
 * @param args 读取路径
 */
export function getInsureValue<T extends object>(obj: T, options: BaseGetOptions): T
export function getInsureValue<T extends object, K1 extends keyof T>(obj: T, options: BaseGetOptions, k1: K1): T[K1]
export function getInsureValue<T extends object, K1 extends keyof T, K2 extends keyof T[K1]>(obj: T, options: BaseGetOptions, k1: K1, k2: K2): T[K1][K2]
export function getInsureValue<T extends object, K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2]>(obj: T, options: BaseGetOptions, k1: K1, k2: K2, k3: K3): T[K1][K2][K3]
export function getInsureValue(obj: any, options: BaseGetOptions = {}, ...args: string[]) {
  Object.assign(options, { strict: true })
  return obj == null ? undefined : baseGet(obj, args, options)
}


function baseGet(object: any, path: string[], { strict, defaultValue }: BaseGetOptions = {}) {
  let index = 0
  const length = path.length
  while (object != null && index < length) {
    object = object[path[index++]]
  }
  if (index === length) {
    return object
  } else {
    if (strict) {
      if (!defaultValue) {
        throw new Error(
          `[getValue] Uncaught TypeError: Object.${path.join('.')} Cannot read property '${path[index]}' of undefined.`,
        )
      } return defaultValue
    } else {
      return undefined
    }
  }
}