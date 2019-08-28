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

  it('number', () => {
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

  it('function', () => {
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

  it('extra field', () => {
    const dataValidation = getDataValidation()
    const testConfig: TDataValidationConfig<FTextColor, BTextColor> = {
      name: 'TextColor',
      rules: {
        color_type: 'string',
        color: 'string',
        gradient: () => false,
      },
    }
    const obj = {
      color_type: 'solid',
      color: 'solid',
      color2: 'solid',
    }
    dataValidation.register('TextColor', testConfig)
    const { verify } = dataValidation.use('TextColor')
    const { result, key } = verify(obj)
    expect(result).toEqual(false)
    expect(key).toEqual('color2')
  })

  it('allow extra field', () => {
    const dataValidation = getDataValidation()
    const testConfig: TDataValidationConfig<FTextColor, BTextColor> = {
      name: 'TextColor',
      extraField: 'allow',
      rules: {
        color_type: 'string',
        color: 'string',
        gradient: () => true,
      },
    }
    const obj = {
      color_type: 'solid',
      color: 'solid',
      color2: 'solid',
    }
    dataValidation.register('TextColor', testConfig)
    const { verify } = dataValidation.use('TextColor')
    const { result } = verify(obj)
    expect(result).toEqual(true)
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

describe('DataValidation verify - Meta', () => {
  it('success', () => {
    const dataValidation = getDataValidation()
    dataValidation.meta.set('color', {
      verify(data) {
        return /rgba\(\d, \d*, \d*, \d*\)/.test(data)
      }
    })
    const textColorConfig: TDataValidationConfig<FTextColor, BTextColor> = {
      rules: {
        color_type: 'string',
        color: 'color',
        gradient: () => true,
      },
    }
    const obj: FTextColor = {
      color_type: 'solid',
      color: 'rgba(0, 0, 0, 1)',
    }
    dataValidation.register('TextColor', textColorConfig)
    const { verify } = dataValidation.use('TextColor')
    const { result } = verify(obj)
    expect(result).toEqual(true)
  })
  it('fail', () => {
    const dataValidation = getDataValidation()
    dataValidation.meta.set('color', {
      verify(data) {
        return /rgba\(\d, \d*, \d*, \d*\)/.test(data)
      }
    })
    const textColorConfig: TDataValidationConfig<FTextColor, BTextColor> = {
      rules: {
        color_type: 'string',
        color: 'color',
        gradient: () => true,
      },
    }
    const obj: FTextColor = {
      color_type: 'solid',
      color: 'rgba(0, 0, 0, X)',
    }
    dataValidation.register('TextColor', textColorConfig)
    const { verify } = dataValidation.use('TextColor')
    const { result, key } = verify(obj)
    expect(result).toEqual(false)
    expect(key).toEqual('color')
  })
  it('no requried', () => {
    const dataValidation = getDataValidation()
    dataValidation.meta.set('color', {
      verify(data) {
        return /rgba\(\d, \d*, \d*, \d*\)/.test(data)
      }
    })
    const textColorConfig: TDataValidationConfig<FTextColor, BTextColor> = {
      rules: {
        color_type: 'string',
        color: 'color',
        gradient: () => true,
      },
    }
    const obj: FTextColor = {
      color_type: 'solid',
    }
    dataValidation.register('TextColor', textColorConfig)
    const { verify } = dataValidation.use('TextColor')
    const { result } = verify(obj)
    expect(result).toEqual(true)
  })
  it('requried', () => {
    const dataValidation = getDataValidation()
    dataValidation.meta.set('color', {
      verify(data) {
        return /rgba\(\d, \d*, \d*, \d*\)/.test(data)
      }
    })
    const textColorConfig: TDataValidationConfig<FTextColor, BTextColor> = {
      rules: {
        color_type: 'string',
        color: {
          type: 'color',
          requried: true,
        },
        gradient: () => true,
      },
    }
    const obj: FTextColor = {
      color_type: 'solid',
    }
    dataValidation.register('TextColor', textColorConfig)
    const { verify } = dataValidation.use('TextColor')
    const { result, key } = verify(obj)
    expect(result).toEqual(false)
    expect(key).toEqual('color')
  })
})

describe('DataValidation verify - rule nesting', () => {
  it('success', () => {
    const dataValidation = getDataValidation()
    dataValidation.meta.set('gradient_type', {
      verify(data) {
        return /linear|radial/.test(data)
      }
    })
    const gradientConfig: TDataValidationConfig<FTextColor['gradient']> = {
      rules: {
        gradient_angle: 'number',
        gradient_type: 'gradient_type',
        stops: () => true,
      },
    }
    const textColorConfig: TDataValidationConfig<FTextColor, BTextColor> = {
      rules: {
        color_type: 'string',
        color: 'color',
        gradient: 'Gradient',
      },
    }
    dataValidation.register('TextColor', textColorConfig)
    dataValidation.register('Gradient', gradientConfig)

    const obj: FTextColor = {
      color_type: 'gradient',
      gradient: {
        gradient_angle: 0,
        gradient_type: 'linear',
        stops: []
      },
    }
    const { verify } = dataValidation.use('TextColor')
    const { result } = verify(obj)
    expect(result).toEqual(true)
  })
  it('fail', () => {
    const dataValidation = getDataValidation()
    dataValidation.meta.set('gradient_type', {
      verify(data) {
        return /linear|radial/.test(data)
      }
    })
    const gradientConfig: TDataValidationConfig<FTextColor['gradient']> = {
      rules: {
        gradient_angle: 'number',
        gradient_type: 'gradient_type',
        stops: () => true,
      },
    }
    const textColorConfig: TDataValidationConfig<FTextColor, BTextColor> = {
      rules: {
        color_type: 'string',
        color: 'color',
        gradient: 'Gradient',
      },
    }
    dataValidation.register('TextColor', textColorConfig)
    dataValidation.register('Gradient', gradientConfig)

    const obj = {
      color_type: 'gradient',
      gradient: {
        gradient_angle: 0,
        gradient_type: 'lainear',
        stops: []
      },
    }
    const { verify } = dataValidation.use('TextColor')
    const { result, key } = verify(obj)
    expect(result).toEqual(false)
    expect(key).toEqual('gradient.gradient_type')
  })
})

describe('DataValidation use cache', () => {
  it('use simple', () => {
    const dataValidation = getDataValidation()
    dataValidation.meta.set('gradient_type', {
      verify(data) {
        return /linear|radial/.test(data)
      }
    })
    const gradientConfig: TDataValidationConfig<FTextColor['gradient']> = {
      rules: {
        gradient_angle: 'number',
        gradient_type: 'gradient_type',
        stops: () => true,
      },
    }
    const textColorConfig: TDataValidationConfig<FTextColor, BTextColor> = {
      rules: {
        color_type: 'string',
        color: 'color',
        gradient: 'Gradient',
      },
    }
    dataValidation.register('TextColor', textColorConfig)
    dataValidation.register('Gradient', gradientConfig)

    const { verify } = dataValidation.use('Gradient')
    verify({})
    expect(dataValidation.cache.maps.size).toEqual(1)
  })

  it('use rule nesting', () => {
    const dataValidation = getDataValidation()
    dataValidation.meta.set('gradient_type', {
      verify(data) {
        return /linear|radial/.test(data)
      }
    })
    const gradientConfig: TDataValidationConfig<FTextColor['gradient']> = {
      rules: {
        gradient_angle: 'number',
        gradient_type: 'gradient_type',
        stops: () => true,
      },
    }
    const textColorConfig: TDataValidationConfig<FTextColor, BTextColor> = {
      rules: {
        color_type: 'string',
        color: 'color',
        gradient: 'Gradient',
      },
    }
    dataValidation.register('TextColor', textColorConfig)
    dataValidation.register('Gradient', gradientConfig)

    const { verify } = dataValidation.use('TextColor')
    verify({
      gradient: {}
    })
    expect(dataValidation.cache.maps.size).toEqual(2)
  })

  it('use rule nesting - no verify', () => {
    const dataValidation = getDataValidation()
    dataValidation.meta.set('gradient_type', {
      verify(data) {
        return /linear|radial/.test(data)
      }
    })
    const gradientConfig: TDataValidationConfig<FTextColor['gradient']> = {
      rules: {
        gradient_angle: 'number',
        gradient_type: 'gradient_type',
        stops: () => true,
      },
    }
    const textColorConfig: TDataValidationConfig<FTextColor, BTextColor> = {
      rules: {
        color_type: 'string',
        color: 'color',
        gradient: 'Gradient',
      },
    }
    dataValidation.register('TextColor', textColorConfig)
    dataValidation.register('Gradient', gradientConfig)

    dataValidation.use('TextColor')
    expect(dataValidation.cache.maps.size).toEqual(1)
  })
})