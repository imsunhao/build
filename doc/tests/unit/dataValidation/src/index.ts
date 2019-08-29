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

function configToConfigLocal(config: Config<any>): ConfigLocal<any> {
  if (!config) return
  if (typeof config !== 'object') {
    throw new Error('[configToConfigLocal] config must be a object')
  }

  return Object.keys(config).reduce((t, k) => {
    const conf = config[k]
    if (conf instanceof Array) {
      t[k] = {
        type: 'Array.string',
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

type TDataValidationMeta = {
  verify: (data: any) => boolean
}

function getMeta(s: string) {
  return {
    verify(value: any) {
      return typeof value === s
    },
  }
}

class DataValidationMeta {
  maps = new Map<string, TDataValidationMeta>()

  constructor() {
    ;['string', 'number', 'bigint', 'boolean', 'symbol', 'undefined', 'object', 'function'].forEach(key => {
      this.set(key, getMeta(key))
    })
  }

  has(key) {
    return this.maps.has(key)
  }

  use(key, value) {
    const meta = this.get(key)
    if (meta) {
      return meta.verify(value)
    }
  }

  get(key) {
    if (this.has(key)) {
      return this.maps.get(key)
    } else {
      console.warn('[DataValidationMeta] get invalid key', key)
    }
  }

  set(key: string, meta: TDataValidationMeta) {
    if (this.has(key)) {
      console.warn('[DataValidationMeta] set repeat key', key)
      return
    }

    this.maps.set(key, meta)
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

export type TVerify = {
  result: boolean
  key?: string
  value?: any
  rule?: TConfig
}

type TUse = {
  verify(data: any, {  }?: {}): TVerify
}

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

  baseVerify(data: any, rules: ConfigLocal<any>, config: TDataValidationConfigLocal<any, any>): TVerify {
    const { extraField, strict } = config
    const sourceMap = Object.keys(rules).reduce((t, k) => {
      t[k] = true
      return t
    }, {})
    const objKeys = Object.keys(data)
    for (const ok of objKeys) {
      const rule = rules[ok]
      const value = data[ok]
      if (!rule) {
        if (extraField === 'allow') continue
        return {
          result: false,
          key: ok,
        }
      }
      delete sourceMap[ok]
      if (!rule.requried && !strict) continue
      if (rule.callback && !rule.callback(value))
        return {
          result: false,
          rule,
          key: ok,
          value,
        }
      else if (rule.type && /^Array\./.test(rule.type)) {
        if (rule.optionalList) {
          const result = rule.optionalList.find(v => {
            return v === value
          })
          if (!result) {
            return {
              result: false,
              rule,
              key: ok,
              value,
            }
          }
        }
      } else if (rule.type && this.meta.has(rule.type)) {
        if (!this.meta.use(rule.type, value))
          return {
            result: false,
            rule,
            key: ok,
            value,
          }
      } else if (rule.type) {
        const dataValidation = this.use(rule.type)
        const result = dataValidation.verify(value)
        if (!result.result)
          return {
            result: false,
            rule: {
              ...rule,
              rule: result.rule,
            },
            key: `${ok}.${result.key}`,
            value: result.value,
          }
      }
    }
    const sourceKeys = Object.keys(sourceMap)
    for (const sk of sourceKeys) {
      const rule = rules[sk]
      if (rule.requried)
        return {
          result: false,
          rule,
          key: sk,
        }
      else if (rule.callback && !rule.callback())
        return {
          result: false,
          rule,
          key: sk,
        }
    }
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
    const { rules: SOURCE, runtime } = config
    const { baseVerify } = this
    const verify = baseVerify.bind(this)
    const result = {
      verify(data, {} = {}): TVerify {
        if (typeof data !== 'object') {
          console.log('[DataValidation] verify arguments[0] must be a object')
          return
        }
        let rules = cloneDeep(SOURCE)
        if (runtime && runtime.rules) {
          rules = runtime.rules(data, rules)
          Object.keys(rules).forEach(key => {
            if (rules[key].requried !== false) {
              rules[key].requried = true
            }
          })
        }
        return verify(data, rules, config)
      },
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
    rules: (data: any, rules: ConfigLocal<S>) => ConfigLocal<S>
  }
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
   * callback
   * - 优先级 2
   */
  callback?: configCallBack

  /**
   * type
   * - 优先级 3
   */
  type?: configAspType
  default?: any
  optionalList?: any[]
  rule?: TConfig
}

type TConfigKey = string

type Config<T> = {
  [P in keyof T]-?: configAspType | configStringArray | configCallBack | TConfig
}

type ConfigLocal<T> = {
  [P in keyof T]-?: TConfig
}
