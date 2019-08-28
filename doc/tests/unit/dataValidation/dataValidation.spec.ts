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

  it('array string', () => {
    const dataValidation = getDataValidation()
    const testConfig: TDataValidationConfig<FTextColor, BTextColor> = {
      name: 'TextColor',
      rules: {
        color_type: ['solid', 'gradient'],
        color: 'string',
        gradient: () => true,
      },
    }
    dataValidation.register('TextColor', testConfig)
    const { verify } = dataValidation.use('TextColor')

    const obj: FTextColor = {
      color_type: 'solid',
    }
    const { result: success } = verify(obj)
    expect(success).toEqual(true)
    const obj2 = {
      color_type: 'solid2',
    }
    const { result, key } = verify(obj2)
    expect(result).toEqual(false)
    expect(key).toEqual('color_type')
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
  it('runtime', () => {
    const dataValidation = getDataValidation()
    const gradientConfig: TDataValidationConfig<FTextColor['gradient']> = {
      rules: {
        gradient_angle: 'number',
        gradient_type: ['linear', 'radial'],
        stops: (stops) => {
          return stops instanceof Array && stops.length >= 2
        },
      },
      runtime: {
        rules(obj: FTextColor['gradient'], rules) {
          if (!obj.gradient_type) return rules
          if (obj.gradient_type === 'radial') {
            rules.gradient_angle = {
              callback(value) {
                return value === 0
              }
            }
          }
          return rules
        }
      }
    }
    const textColorConfig: TDataValidationConfig<FTextColor, BTextColor> = {
      rules: {
        color_type: ['solid', 'gradient'],
        color: 'string',
        gradient: 'Gradient',
      },
      runtime: {
        rules(obj: FTextColor, rules) {
          if (!obj.color_type) return rules
          if (obj.color_type === 'solid') {
            rules.color.requried = true
          } else if (obj.color_type === 'gradient') {
            rules.gradient.requried = true
          }
          return rules
        }
      },
    }
    dataValidation.register('TextColor', textColorConfig)
    dataValidation.register('Gradient', gradientConfig)

    const { verify } = dataValidation.use('TextColor')

    const test1 = verify({
      color_type: 'gradient',
      gradient: {
        gradient_angle: 0,
        gradient_type: 'radial',
        stops: [ 'stop1', 'stop2' ]
      },
    })
    expect(test1.result).toEqual(true)
    const test2 = verify({
      color_type: 'gradient',
      gradient: {
        gradient_angle: 10,
        gradient_type: 'radial',
        stops: [ 'stop1', 'stop2' ]
      },
    })
    expect(test2.result).toEqual(false)
    expect(test2.key).toEqual('gradient.gradient_angle')

    const test3 = verify({
      color_type: 'solid',
    })
    expect(test3.result).toEqual(false)
    expect(test3.key).toEqual('color')

    const test4 = verify({
      color_type: 'solid2',
    })
    expect(test4.result).toEqual(false)
    expect(test4.key).toEqual('color_type')
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

// describe('DataValidation update', () => {
//   it('success', () => {
//     const dataValidation = getDataValidation()
//     dataValidation.meta.set('gradient_type', {
//       verify(data) {
//         return /linear|radial/.test(data)
//       }
//     })
//     const gradientConfig: TDataValidationConfig<FTextColor['gradient']> = {
//       rules: {
//         gradient_angle: 'number',
//         gradient_type: 'gradient_type',
//         stops: () => true,
//       },
//     }
//     const textColorConfig: TDataValidationConfig<FTextColor, BTextColor> = {
//       rules: {
//         color_type: 'string',
//         color: 'color',
//         gradient: 'Gradient',
//       },
//     }
//     dataValidation.register('TextColor', textColorConfig)
//     dataValidation.register('Gradient', gradientConfig)

//     const obj: FTextColor = {
//       color_type: 'gradient',
//       gradient: {
//         gradient_angle: 0,
//         gradient_type: 'linear',
//         stops: []
//       },
//     }
//     const { verify } = dataValidation.use('TextColor')
//     const { result } = verify(obj)
//     expect(result).toEqual(true)
//   })
// })