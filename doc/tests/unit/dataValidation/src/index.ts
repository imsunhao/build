let DATA_VALIDATION: DataValidation

type DataValidationConstructor = {
  isSecurity?: boolean
}

function cloneDeep<T>(data: T): T {
  if (typeof data !== 'object') return data
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
    if (typeof conf === 'object') {
      t[k] = conf
    } else if (typeof conf === 'function') {
      t[k] = {
        callback: conf,
      }
    } else
      t[k] = {
        type: conf,
      }
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

export type TVerify = {
  result: boolean
  key?: string
  value?: any
  config?: TConfig
}

export class DataValidation {
  config: DataValidationConfig = new DataValidationConfig()
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
  static baseVerify(data: any, rules: ConfigLocal<any>): TVerify {
    const sourceMap = Object.keys(rules).reduce((t, k) => {
      t[k] = true
      return t
    }, {})
    const objKeys = Object.keys(data)
    for (const ok of objKeys) {
      const config = rules[ok]
      const value = data[ok]
      if (!config) {
        console.log('[DataValidation] verify: 多余字段', ok)
        return {
          result: false,
          key: ok,
        }
      }
      delete sourceMap[ok]
      if (config.callback && !config.callback(value))
        return {
          result: false,
          config,
          key: ok,
          value,
        }
      else if (typeof value !== config.type)
        return {
          result: false,
          config,
          key: ok,
          value,
        }
    }
    const sourceKeys = Object.keys(sourceMap)
    for (const sk of sourceKeys) {
      const config = rules[sk]
      if (config.requried)
        return {
          result: false,
          config,
          key: sk,
        }
      else if (config.callback && !config.callback())
        return {
          result: false,
          config,
          key: sk,
        }
    }
    return {
      result: true,
    }
  }

  use(configName: string) {
    const { rules: SOURCE, runtime } = this.config.get(configName)
    return {
      verify(data, {} = {}): TVerify {
        if (typeof data !== 'object') {
          console.log('[DataValidation] verify arguments[0] must be a object')
          return
        }
        let rules = cloneDeep(SOURCE)
        if (runtime && runtime.rules) {
          rules = runtime.rules(data, rules)
        }
        return DataValidation.baseVerify(data, rules)
      },
    }
  }
}
type TDataValidationConfigBase<S, T> = {
  name: string
  runtime?: {
    rules: (data: any, rules: ConfigLocal<S>) => ConfigLocal<S>
  }
}

export type TDataValidationConfig<S, T> = TDataValidationConfigBase<S, T> & {
  rules: Config<S>
  target?: Config<T>
}

type TDataValidationConfigLocal<S, T> = TDataValidationConfigBase<S, T> & {
  rules: ConfigLocal<S>
  target?: ConfigLocal<T>
}

type configAspType = 'string' | 'number' | 'undefined' | 'function' | 'symbol'
type configCallBack = (value?: any) => boolean

type TConfig = {
  type?: configAspType
  callback?: configCallBack
  default?: any
  requried?: boolean
}

type Config<T> = {
  [P in keyof T]-?: configAspType | configCallBack | TConfig
}

type ConfigLocal<T> = {
  [P in keyof T]-?: TConfig
}
