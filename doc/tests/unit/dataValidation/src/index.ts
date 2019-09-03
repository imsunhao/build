let DATA_VALIDATION: DataValidation

type DataValidationConstructor = {
  isSecurity?: boolean
}

function cloneDeep<T>(data: T): T {
  if (typeof data !== 'object') return data
  if (data instanceof Array) {
    return data.map(d => {
      return cloneDeep(d)
    }) as any
  }
  return Object.keys(data).reduce((t, o) => {
    t[o] = cloneDeep(data[o])
    return t
  }, {}) as any
}

function mergeBase(src, target, { isSimple }: any = {}) {
  if (typeof target !== 'object' || typeof src !== 'object') return target
  Object.keys(target).forEach(t => {
    if (typeof target[t] === 'object' && typeof src[t] === 'object') {
      if (isSimple) return
      src[t] = mergeBase(src[t], target[t])
    } else {
      src[t] = target[t]
    }
  })
  return src
}

function merge(...args) {
  return args.reduce((t, o) => {
    if (t === o) return t
    return mergeBase(t, cloneDeep(o))
  }, args[0])
}

function mergeSimple(...args) {
  return args.reduce((t, o) => {
    if (t === o) return t
    return mergeBase(t, cloneDeep(o), { isSimple: true })
  }, args[0])
}

function configToConfigLocal(config: Config<any>): ConfigLocal<any> {
  if (!config) return
  if (typeof config !== 'object') {
    throw new Error('[configToConfigLocal] config must be a object')
  }

  return Object.keys(config).reduce((t, k) => {
    const conf = config[k]
    if (conf instanceof Array) {
      t[k] = {
        type: 'Optional',
        optionalList: conf,
      }
    } else if (typeof conf === 'object') {
      t[k] = conf
    } else if (typeof conf === 'function') {
      t[k] = {
        callback: conf,
      }
    } else
      t[k] = {
        type: conf,
      }

    if (t[k].requried !== false) t[k].requried = true
    return t
  }, {})
}

class DataValidationConfig {
  maps = new Map<string, TDataValidationConfigLocal<any, any>>()

  get(name) {
    if (this.maps.has(name)) {
      return this.maps.get(name)
    } else {
      console.warn('[DataValidationConfig] get invalid name', name)
    }
  }

  set(config: TDataValidationConfig<any, any>) {
    const { name, rules, target } = config
    if (this.maps.has(name)) {
      console.warn('[DataValidationConfig] set repeat name', name)
      return
    }

    const result = {
      ...config,
      rules: configToConfigLocal(rules),
      target: configToConfigLocal(target),
    }

    this.maps.set(name, result)
  }
}

function getMeta(s: string): TDataValidationMeta {
  return {
    verify(value: any) {
      return typeof value === s
    },
    fix: false,
  }
}

class DataValidationMeta {
  maps = new Map<string, TDataValidationMeta>()

  constructor() {
    ;['string', 'number', 'bigint', 'boolean', 'symbol', 'undefined', 'object', 'function'].forEach(type => {
      this.set(type, getMeta(type))
    })
    this.set('Array', {
      verify(value: any) {
        return value instanceof Array
      },
      fix: false,
    })
  }

  has(type) {
    return this.maps.has(type)
  }

  use(type: string, data: any, key: string, opts: baseVerifyOptions) {
    const meta = this.get(type)
    if (meta) {
      if (meta.prerequisites) {
        if (typeof meta.prerequisites === 'string') meta.prerequisites = [meta.prerequisites]
        const length = meta.prerequisites.length
        for (let i = 0; i < length; i++) {
          const t = meta.prerequisites[i]
          const result = this.use(t, data, key, opts)
          if (!result) return false
        }
      }
      const value = data[key]
      const result = meta.verify(value)
      const { fix } = opts
      if (!result && fix && meta.fix) {
        const fixResult = meta.fix(value)
        if (fixResult.result) {
          data[key] = fixResult.value
          return true
        } else {
          return false
        }
      }
      return result
    }
  }

  get(type) {
    if (this.has(type)) {
      return this.maps.get(type)
    } else {
      console.warn('[DataValidationMeta] get invalid type', type)
    }
  }

  set(type: string, meta: TDataValidationMeta) {
    if (this.has(type)) {
      console.warn('[DataValidationMeta] set repeat type', type)
      return
    }

    this.maps.set(type, meta)
  }
}

class DataValidationCache {
  maps = new Map<string, TUse>()

  get(key) {
    return this.maps.get(key)
  }

  set(key: string, data: TUse) {
    if (this.maps.has(key)) {
      console.warn('[DataValidationCache] set repeat key', key)
      return
    }
    this.maps.set(key, data)
  }
}

class Stack<T> {
  items: T[] = []
  get isAmpty() {
    return this.items.length === 0
  }
  push(element: T) {
    this.items.push(element)
  }
  pop() {
    return this.items.pop()
  }
  peek() {
    return this.items[this.items.length - 1]
  }
  clear() {
    this.items = []
  }
  size() {
    return this.items.length
  }
}

class DataValidationTransaction {
  stack = new Stack<THistory>()
  isRollbacking = false
  isBeginning = false
  data: any

  record(key: string, oldValue: any) {
    const { isRollbacking, isBeginning } = this
    if (!isBeginning) {
      console.warn('[DataValidationHistory] record need start')
      return
    }
    if (isRollbacking) {
      throw new Error('[DataValidationHistory] record isRollbacking')
    }
    this.stack.push({
      key,
      cloneDeepValue: cloneDeep(oldValue),
      oldValue: oldValue,
    })
  }

  rollback() {
    const { data, isBeginning } = this
    if (!isBeginning) {
      console.warn('[DataValidationHistory] rollback need start')
      return
    }
    this.isRollbacking = true
    let historyRecord = this.stack.pop()
    while (historyRecord) {
      const { key, oldValue, cloneDeepValue } = historyRecord
      if (oldValue instanceof Array) {
        /**
         * 现在对于 Array
         * 直接替换掉原始对象
         */
        data[key] = cloneDeepValue
      } else if (typeof oldValue === 'object' && typeof data[key] === 'object') {
        const objMap = Object.keys(data[key]).reduce((t, k) => {
          t.set(k, true)
          return t
        }, new Map())
        Object.keys(cloneDeepValue).forEach(k => {
          /**
           * 过于深层的数据不会保留原始对象
           */
          data[key] = cloneDeepValue[k]
          if (objMap.has(key)) {
            objMap.delete(key)
          }
        })
        for (const k of objMap.keys()) {
          delete data[k]
        }
      } else if (typeof oldValue === 'object' && typeof data[key] !== 'object') {
        data[key] = oldValue
      } else {
        data[key] = cloneDeepValue
      }
      historyRecord = this.stack.pop()
    }
    this.isRollbacking = false
  }

  start(data: any) {
    if (typeof data !== 'object') {
      console.warn('[DataValidationHistory] start data must be a object')
      return
    }
    this.data = data
    this.isBeginning = true
  }

  clear() {
    this.isBeginning = false
    this.isRollbacking = false
    this.data = undefined
    this.stack.clear()
  }

  success() {
    this.clear()
  }

  fail() {
    this.rollback()
    this.clear()
  }
}

type THistory = {
  key: string
  oldValue: any
  cloneDeepValue: any
}

export type TVerify = {
  result: boolean
  key?: string
  value?: any
  rule?: TConfig
}

type TUse = {
  verify(data: any, opts?: { fix?: boolean, update?: boolean, updateData?: any }): TVerify

  /**
   * 自动修正
   * - 一定会改变原始对象
   */
  fix?: (data: any, opts?: {}) => TVerify

  /**
   * 自动修正
   * - 一定会改变原始对象
   * - 不会改变 updateData 对象
   */
  update?: (data: any, updateData: any, opts?: {}) => TVerify
}

type baseVerifyOptions = TUse['verify'] extends (data: any, opts: infer T) => any ? T : unknown

export class DataValidation {
  config = new DataValidationConfig()
  meta = new DataValidationMeta()
  cache = new DataValidationCache()

  constructor({ isSecurity }: DataValidationConstructor = {}) {
    if (!isSecurity) {
      console.error('[DataValidation] is single case, please use DataValidation.getInstance()')
      return
    }
  }

  static getInstance() {
    if (DATA_VALIDATION) return DATA_VALIDATION
    else {
      DATA_VALIDATION = new DataValidation({ isSecurity: true })
      return DATA_VALIDATION
    }
  }

  baseVerify(
    data: any,
    rules: ConfigLocal<any>,
    config: TDataValidationConfigLocal<any, any>,
    opts: baseVerifyOptions = {},
  ): TVerify {
    const transaction = new DataValidationTransaction()
    transaction.start(data)
    const { extraField, strict, fixes } = config
    const sourceMap = Object.keys(rules).reduce((t, k) => {
      t[k] = true
      return t
    }, {})
    const objKeys = Object.keys(data)
    function beforeFail() {
      transaction.fail()
    }
    function beforSetData(key) {
      transaction.record(key, data[key])
    }
    function setData(key, value) {
      data[key] = value
    }
    function autoFix(key) {
      if (!opts.fix || !fixes) return false
      const fix = fixes[key]
      if (!fix) return false
      const fixResult = fix(data[key])
      if (fixResult.result) {
        beforSetData(key)
        setData(key, fixResult.value)
        return true
      }
      return false
    }
    function autoUpdate(key) {
      if (!opts.update) return false
      const updateData = cloneDeep(opts.updateData)
      const updates = config.updates || {}
      const update = updates[key]
      if (typeof data[key] === 'object' && !update) return true
      if (updateData && update) {
        beforSetData(key)
        setData(key, update(data[key], updateData[key]))
        return true
      } else if (updateData && updateData.hasOwnProperty(key)) {
        beforSetData(key)
        setData(key, updateData[key])
        return true
      }
      return false
    }
    for (const ok of objKeys) {
      const rule = rules[ok]
      autoUpdate(ok)
      const value = data[ok]
      if (!rule) {
        /**
         * 多余字段无法修复
         * - 只能选择保留
         * - 或者选择删除
         */
        if (extraField === 'allow') continue
        beforeFail()
        return {
          result: false,
          key: ok,
        }
      }
      delete sourceMap[ok]
      /**
       * 不是严格模式 不会被修复
       */
      if (!rule.requried && !strict) continue

      if (rule.type && rule.type === 'Optional') {
        if (rule.optionalList) {
          const result = rule.optionalList.find(v => {
            return v === value
          })
          if (!result) {
            if (autoFix(ok)) continue
            beforeFail()
            return {
              result: false,
              rule,
              key: ok,
              value,
            }
          }
        }
      } else if (rule.type && rule.type === 'Array') {
        if (!this.meta.use('Array', data, ok, opts)) {
          beforeFail()
          /**
           * TODO: array 暂时不支持 fix
           */
          return {
            result: false,
            rule,
            key: ok,
            value,
          }
        }
        if (rule.itemType) {
          if (this.meta.has(rule.itemType)) {
            for (let i = 0; i < value.length; i++) {
              if (!this.meta.use(rule.itemType, value[i], ok, opts)) {
                beforeFail()
                /**
                 * TODO: array 暂时不支持 fix
                 */
                return {
                  result: false,
                  rule,
                  key: ok,
                  value,
                }
              }
            }
          } else {
            const dataValidation = this.use(rule.itemType)
            for (let i = 0; i < value.length; i++) {
              const deepResult = dataValidation.verify(value[i], opts)
              if (!deepResult.result) {
                beforeFail()
                /**
                 * TODO: 现在还没想好怎么做deepValidation的自动修正
                 */
                return {
                  result: false,
                  rule: {
                    ...rule,
                    rule: deepResult.rule,
                  },
                  key: `${ok}[${i}].${deepResult.key}`,
                  value: deepResult.value,
                }
              }
            }
          }
        }
      } else if (rule.type && this.meta.has(rule.type)) {
        if (!this.meta.use(rule.type, data, ok, opts)) {
          if (autoFix(ok)) continue
          beforeFail()
          return {
            result: false,
            rule,
            key: ok,
            value,
          }
        }
      } else if (rule.type) {
        const dataValidation = this.use(rule.type)
        let options = opts
        if (opts.update && opts.updateData) {
          const updateData = opts.updateData ? opts.updateData[ok] : undefined
          options = {
            ...opts,
            updateData,
          }
        }
        const deepResult = dataValidation.verify(value, options)
        if (!deepResult.result) {
          beforeFail()
          /**
           * TODO: 现在还没想好怎么做deepValidation的自动修正
           */
          return {
            result: false,
            rule: {
              ...rule,
              rule: deepResult.rule,
            },
            key: `${ok}.${deepResult.key}`,
            value: deepResult.value,
          }
        }
      }

      if (rule.callback && !rule.callback(value)) {
        if (autoFix(ok)) continue
        beforeFail()
        return {
          result: false,
          rule,
          key: ok,
          value,
        }
      }
    }
    const sourceKeys = Object.keys(sourceMap)
    for (const sk of sourceKeys) {
      const updateResult = autoUpdate(sk)
      const rule = rules[sk]
      if (!rule.requried && !strict) continue
      if (!updateResult && rule.requried) {
        if (autoFix(sk)) continue
        beforeFail()
        return {
          result: false,
          rule,
          key: sk,
        }
      }
    }
    transaction.success()
    return {
      result: true,
    }
  }

  register(key: string, config: TDataValidationConfig<any, any>) {
    config.name = key
    this.config.set(config)
  }

  use(configName: string): TUse {
    const catchResult = this.cache.get(configName)
    if (catchResult) return catchResult
    const config = this.config.get(configName)
    if (!config) throw new Error('[DataValidation] use 未知的 configName ' + configName)

    const { rules: SOURCE, runtime } = config
    const { baseVerify } = this
    const verify = baseVerify.bind(this)
    const result: TUse = {
      verify(data, opts = {}) {
        if (typeof data !== 'object') {
          console.log('[DataValidation] verify arguments[0] must be a object')
          return
        }
        let rules = cloneDeep(SOURCE)
        if (runtime && runtime.rules) {
          let runtimeData = data
          if (opts.update) {
            if (runtime.deep) runtimeData = merge({}, data, opts.updateData)
            else runtimeData = mergeSimple({}, data, opts.updateData)
          }
          rules = runtime.rules(runtimeData, rules)
          Object.keys(rules).forEach(key => {
            if (rules[key].requried !== false) {
              rules[key].requried = true
            }
          })
        }
        return verify(data, rules, config, opts)
      },
      fix(data) {
        return result.verify(data, { fix: true })
      },
      update(data, updateData) {
        return result.verify(data, {
          update: true,
          updateData,
        })
      }
    }
    this.cache.set(configName, result)
    return result
  }
}
type TDataValidationConfigBase<S, T> = {
  name?: string
  /**
   * 多余字段处理
   */
  extraField?: 'allow' | false
  /**
   * 是否为严格模式
   * - 严格模式校验规则 即使 field不是必须的 也校验 正确性
   * - 默认 否
   */
  strict?: boolean
  runtime?: {
    /**
     * 是否启用深层次的数据支持
     * - 作用于 update
     * - 如果你在runtime中计算rules需要依赖一个深层数据 此选项必须为true
     */
    deep?: boolean
    rules: (data: any, rules: ConfigLocal<S>) => ConfigLocal<S>
  }
  /**
   * 自动修正策略
   */
  fixes?: {
    [k in keyof S]?: TDataValidationFix['fix']
  }
  /**
   * 数据更新策略
   */
  updates?: {
    [k in keyof S]?: TDataValidationUpdate['update']
  }
}

type TDataValidationFix = {
  fix?: ((data: any) => TVerify) | false
}

type TDataValidationUpdate = {
  update?: ((data: any, updateData: any) => any)
}

type TDataValidationMeta = Required<TDataValidationFix> & TDataValidationUpdate & {
  prerequisites?: string | string[]
  verify: (data: any) => boolean
}

export type TDataValidationConfig<S, T = any> = TDataValidationConfigBase<S, T> & {
  rules: Config<S>
  target?: Config<T>
}

type TDataValidationConfigLocal<S, T> = TDataValidationConfigBase<S, T> & {
  rules: ConfigLocal<S>
  target?: ConfigLocal<T>
}

type configAspType = TConfigKey | 'string' | 'number' | 'undefined' | 'function' | 'symbol'
type configCallBack = (value?: any) => boolean
type configStringArray = string[]

type TConfig = {
  /**
   * requried
   * - 优先级 1
   * - 默认为 true
   * - runtime 中 不指定 required 也会默认为 true
   */
  requried?: boolean

  /**
   * type
   * - 优先级 2
   */
  type?: configAspType

  /**
   * callback
   * - 优先级 最低
   */
  callback?: configCallBack

  default?: any

  /**
   * Optional 专用
   * 值 必须 属于 optionalList
   */
  optionalList?: any[]

  /**
   * Array专用
   * - array item 的 类型
   * - 不支持一个数组存在多类型
   */
  itemType?: string

  rule?: TConfig
}

type TConfigKey = string

type Config<T> = {
  [P in keyof T]-?: configAspType | configStringArray | configCallBack | TConfig
}

type ConfigLocal<T> = {
  [P in keyof T]-?: TConfig
}
