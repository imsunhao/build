import { TextColor as BTextColor } from './src/back'
import { TextColor as FTextColor } from './src/front'
import { TDataValidationConfig, DataValidation } from './src/index'

function getDataValidation() {
  return new DataValidation({ isSecurity: true })
}

describe('DataValidation verify', () => {
  it('success', () => {
    const dataValidation = getDataValidation()
    const testConfig: TDataValidationConfig<FTextColor, BTextColor> = {
      name: 'TextColor',
      rules: {
        color_type: 'string',
        color: 'string',
        gradient: () => true,
      },
    }
    const obj: FTextColor = {
      color_type: 'solid',
    }
    dataValidation.register('TextColor', testConfig)
    const { verify } = dataValidation.use('TextColor')
    const { result } = verify(obj)
    expect(result).toEqual(true)
  })

  it('color_type number', () => {
    const dataValidation = getDataValidation()
    const testConfig: TDataValidationConfig<FTextColor, BTextColor> = {
      name: 'TextColor',
      rules: {
        color_type: {
          type: 'number',
          requried: true
        },
        color: 'string',
        gradient: () => true,
      },
    }
    const obj: FTextColor = {
      color_type: 'solid',
    }
    dataValidation.register('TextColor', testConfig)
    const { verify } = dataValidation.use('TextColor')
    const { result, key } = verify(obj)
    expect(result).toEqual(false)
    expect(key).toEqual('color_type')
  })

  it('requried success', () => {
    const dataValidation = getDataValidation()
    const testConfig: TDataValidationConfig<FTextColor, BTextColor> = {
      name: 'TextColor',
      rules: {
        color_type: {
          type: 'string',
          requried: true
        },
        color: 'string',
        gradient: () => true,
      },
    }
    const obj: FTextColor = {
      color_type: 'solid',
    }
    dataValidation.register('TextColor', testConfig)
    const { verify } = dataValidation.use('TextColor')
    const { result } = verify(obj)
    expect(result).toEqual(true)
  })

  it('requried fail', () => {
    const dataValidation = getDataValidation()
    const testConfig: TDataValidationConfig<FTextColor, BTextColor> = {
      name: 'TextColor',
      rules: {
        color_type: {
          type: 'string',
          requried: true
        },
        color: 'string',
        gradient: () => true,
      },
    }
    const obj = {}
    dataValidation.register('TextColor', testConfig)
    const { verify } = dataValidation.use('TextColor')
    const { result } = verify(obj)
    expect(result).toEqual(false)
  })

  it('gradient function false', () => {
    const dataValidation = getDataValidation()
    const testConfig: TDataValidationConfig<FTextColor, BTextColor> = {
      name: 'TextColor',
      rules: {
        color_type: 'string',
        color: 'string',
        gradient: () => false,
      },
    }
    const obj: FTextColor = {
      color_type: 'solid',
    }
    dataValidation.register('TextColor', testConfig)
    const { verify } = dataValidation.use('TextColor')
    const { result, key } = verify(obj)
    expect(result).toEqual(false)
    expect(key).toEqual('gradient')
  })

})

describe('DataValidation verify - runtime', () => {
  it('success', () => {
    const dataValidation = getDataValidation()
    const testConfig: TDataValidationConfig<FTextColor, BTextColor> = {
      name: 'TextColor',
      rules: {
        color_type: 'string',
        color: 'string',
        gradient: () => true,
      },
      runtime: {
        rules(obj: FTextColor, rules) {
          if (!obj.color_type) return rules
          if (obj.color_type === 'solid') {
            rules.color = {
              type: 'string',
              requried: true,
            }
          }
          return rules
        }
      },
    }
    const obj: FTextColor = {
      color_type: 'solid',
      color: 'string',
    }
    dataValidation.register('TextColor', testConfig)
    const { verify } = dataValidation.use('TextColor')
    const { result } = verify(obj)
    expect(result).toEqual(true)
  })
  it('fail', () => {
    const dataValidation = getDataValidation()
    const testConfig: TDataValidationConfig<FTextColor, BTextColor> = {
      name: 'TextColor',
      rules: {
        color_type: 'string',
        color: 'string',
        gradient: {
          type: 'number'
        },
      },
      runtime: {
        rules(obj: FTextColor, rules) {
          if (!obj.color_type) return rules
          if (obj.color_type === 'solid') {} else {
            rules.gradient.requried = true
          }
          return rules
        }
      },
    }
    const obj: FTextColor = {
      color_type: 'gradient',
    }
    dataValidation.register('TextColor', testConfig)
    const { verify } = dataValidation.use('TextColor')
    const { result, key } = verify(obj)
    expect(result).toEqual(false)
    expect(key).toEqual('gradient')
  })
})
