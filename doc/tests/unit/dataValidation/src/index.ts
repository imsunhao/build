let DATA_VALIDATION: DataValidation

type DataValidationConstructor = {
  isSecurity?: boolean
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
    const { name, source, target } = config
    if (this.maps.has(name)) {
      console.warn('[DataValidationConfig] set repeat name', name)
    }

    const result = {
      name,
      source: configToConfigLocal(source),
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

  use(configName: string) {
    const { source } = this.config.get(configName)
    return {
      verify(obj, {} = {}): TVerify {
        if (typeof obj !== 'object') {
          console.log('[DataValidation] verify arguments[0] must be a object')
          return
        }
        const sourceMap = Object.keys(source).reduce((t, k) => {
          t[k] = true
          return t
        }, {})
        const objKeys = Object.keys(obj)
        for (const ok of objKeys) {
          const config = source[ok]
          const value = obj[ok]
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
          const config = source[sk]
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
      },
    }
  }
}

export type TDataValidationConfig<S, T> = {
  name: string
  source: Config<S>
  target?: Config<T>
}

type TDataValidationConfigLocal<S, T> = {
  name: string
  source: ConfigLocal<S>
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
