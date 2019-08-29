import { TextColor as BTextColor, Gradient as BGradient } from './src/back'
import { TextColor as FTextColor, Gradient as FGradient } from './src/front'
import { TDataValidationConfig, DataValidation } from './src/index'

const defaultColor = 'rgba(0, 0, 0, 0)'
const defaultBackgroundColor = 'rgba(0, 0, 0, 1)'
// --- start 验证数据完整性 ---
describe('DataValidation verify', () => {
  it('success', () => {
    const dataValidation = getDataValidation()
    const testConfig: TDataValidationConfig<FTextColor, BTextColor> = {
      name: 'TextColor',
      rules: {
        color_type: 'string',
        color: {
          type: 'string',
          requried: false,
        },
        gradient: {
          callback() {
            return true
          },
          requried: false,
        },
      },
    }
    const obj: FTextColor = {
      color_type: 'solid',
    }
    dataValidation.register('TextColor', testConfig)
    const { verify } = dataValidation.use('TextColor')
    const test = verify(obj)
    expect(test.result).toEqual(true)
  })

  it('number', () => {
    const dataValidation = getDataValidation()
    const testConfig: TDataValidationConfig<FTextColor, BTextColor> = {
      name: 'TextColor',
      rules: {
        color_type: {
          type: 'number',
          requried: true,
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
        color_type: 'string',
        color: {
          type: 'string',
          requried: false,
        },
        gradient: {
          callback() {
            return true
          },
          requried: false,
        },
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
          requried: true,
        },
        color: 'string',
        gradient: () => true,
      },
    }
    const obj = {}
    dataValidation.register('TextColor', testConfig)
    const { verify } = dataValidation.use('TextColor')
    const { result, key } = verify(obj)
    expect(result).toEqual(false)
    expect(key).toEqual('color_type')
  })

  it('function', () => {
    const dataValidation = getDataValidation()
    const testConfig: TDataValidationConfig<FTextColor, BTextColor> = {
      name: 'TextColor',
      rules: {
        color_type: {
          type: 'string',
          requried: true,
        },
        color: {
          type: 'string',
          requried: false,
        },
        gradient: {
          callback() {
            return false
          },
          requried: true,
        },
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
        color: {
          type: 'string',
          requried: false,
        },
        gradient: {
          callback() {
            return true
          },
          requried: false,
        },
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
      gradient: 'sss',
      color2: 'solid',
    }
    dataValidation.register('TextColor', testConfig)
    const { verify } = dataValidation.use('TextColor')
    const test = verify(obj)
    expect(test.result).toEqual(true)
  })
})

describe('DataValidation verify - runtime', () => {
  it('success', () => {
    const dataValidation = getDataValidation()
    const testConfig: TDataValidationConfig<FTextColor, BTextColor> = {
      name: 'TextColor',
      rules: {
        color_type: ['solid', 'gradient'],
        color: {
          type: 'string',
          requried: false,
        },
        gradient: {
          callback() {
            return true
          },
          requried: false,
        },
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
        },
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
        color_type: ['solid', 'gradient'],
        color: {
          type: 'string',
          requried: false,
        },
        gradient: {
          type: 'string',
          requried: false,
        },
      },
      runtime: {
        rules(obj: FTextColor, rules) {
          if (!obj.color_type) return rules
          if (obj.color_type === 'solid') {
          } else {
            rules.gradient.requried = true
          }
          return rules
        },
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
      },
      fix: false,
    })
    const textColorConfig: TDataValidationConfig<FTextColor, BTextColor> = {
      rules: {
        color_type: ['solid', 'gradient'],
        color: {
          type: 'color',
        },
        gradient: {
          callback() {
            return true
          },
          requried: false,
        },
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
      },
      fix: false,
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
    const textColorConfig: TDataValidationConfig<FTextColor, BTextColor> = {
      rules: {
        color_type: ['solid', 'gradient'],
        color: {
          type: 'color',
          requried: false,
        },
        gradient: {
          callback() {
            return true
          },
          requried: false,
        },
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
      },
      fix: false,
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
  it('meta prerequisite', () => {
    const dataValidation = getDataValidation()
    dataValidation.meta.set('Color', {
      prerequisites: 'string',
      verify(data) {
        return /rgba\(\d, \d*, \d*, \d*\)/.test(data)
      },
      fix: false,
    })
    dataValidation.meta.set('BackgroundColor', {
      prerequisites: ['Color'],
      verify(data) {
        return parseStringToRgba(data).a === 1
      },
      fix: false,
    })
    const backgroundColorConfig: TDataValidationConfig<any, any> = {
      rules: {
        bcolor: 'BackgroundColor',
        color: 'Color',
      },
    }
    dataValidation.register('Background', backgroundColorConfig)

    const { verify } = dataValidation.use('Background')

    const test = verify({
      color: defaultColor,
      bcolor: defaultBackgroundColor,
    })
    expect(test.result).toEqual(true)

    const test2 = verify({
      color: defaultColor,
      bcolor: defaultColor,
    })
    expect(test2.result).toEqual(false)
    expect(test2.key).toEqual('bcolor')

    const test3 = verify({
      bcolor: defaultBackgroundColor,
      color: 1,
    })
    expect(test3.result).toEqual(false)
    expect(test3.key).toEqual('color')
  })
})

describe('DataValidation verify Array', () => {
  const dataValidation = getDataValidation()
  dataValidation.meta.set('Color', {
    prerequisites: ['string'],
    verify(data) {
      return /rgba\(\d, \d*, \d*, \d*\)/.test(data)
    },
    fix: false,
  })
  const rgbaColorConfig: TDataValidationConfig<FGradient['color'], any> = {
    rules: {
      r: 'number',
      g: 'number',
      b: 'number',
      a: 'number',
    },
  }
  const gradientStopConfig: TDataValidationConfig<FGradient, BGradient> = {
    rules: {
      color: 'RgbaColor',
      position: 'number',
    },
  }
  const gradientConfig: TDataValidationConfig<FTextColor['gradient']> = {
    strict: false,
    rules: {
      gradient_angle: 'number',
      gradient_type: ['linear', 'radial'],
      stops: {
        type: 'Array',
        itemType: 'GradientStop',
      },
    },
    runtime: {
      rules(obj: FTextColor['gradient'], rules) {
        if (!obj.gradient_type) return rules
        if (obj.gradient_type === 'radial') {
          rules.gradient_angle = {
            callback(value) {
              return value === 0
            },
          }
        }
        return rules
      },
    },
  }
  const textColorConfig: TDataValidationConfig<FTextColor, BTextColor> = {
    strict: false,
    rules: {
      color_type: ['solid', 'gradient'],
      color: {
        type: 'FColor',
        requried: false,
      },
      gradient: {
        type: 'Gradient',
        requried: false,
      },
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
      },
    },
  }
  dataValidation.register('RgbaColor', rgbaColorConfig)
  dataValidation.register('GradientStop', gradientStopConfig)
  dataValidation.register('TextColor', textColorConfig)
  dataValidation.register('Gradient', gradientConfig)

  it('deep Array', () => {
    const { verify } = dataValidation.use('TextColor')
    const data: FTextColor = {
      color_type: 'gradient',
      gradient: {
        gradient_angle: 10,
        gradient_type: 'linear',
        stops: [
          {
            position: 0,
            color: {
              r: 0,
              g: 0,
              b: 0,
              a: 0,
            },
          },
          {
            position: 100,
            color: {
              r: 0,
              g: 0,
              b: 0,
              a: 0,
            },
          },
        ],
      },
    }
    const test = verify(data)
    expect(test.result).toEqual(true)
  })
  it('deep Array fail', () => {
    const { verify } = dataValidation.use('TextColor')

    const data2 = {
      color_type: 'gradient',
      gradient: {
        gradient_angle: 10,
        gradient_type: 'linear',
        stops: [
          {
            position: 0,
            color: {
              r: 0,
              g: 0,
              b: 0,
              a: 0,
            },
          },
          {
            position: 100,
            color: {
              r: 'x',
              g: 0,
              b: 0,
              a: 0,
            },
          },
        ],
      },
    }
    const test2 = verify(data2)
    expect(test2.result).toEqual(false)
    expect(test2.key).toEqual('gradient.stops[1].color.r')

    const data3 = {
      color_type: 'gradient',
      gradient: {
        gradient_angle: 10,
        gradient_type: 'linear',
        stops: [
          {
            position: '123',
            color: {
              r: 0,
              g: 0,
              b: 0,
              a: 0,
            },
          },
          {
            position: '100',
            color: {
              r: 1,
              g: 0,
              b: 0,
              a: 0,
            },
          },
        ],
      },
    }
    const test3 = verify(data3)
    expect(test3.result).toEqual(false)
    expect(test3.key).toEqual('gradient.stops[0].position')
  })
})

describe('DataValidation verify - rule-nesting', () => {
  it('success', () => {
    const dataValidation = getDataValidation()
    dataValidation.meta.set('gradient_type', {
      verify(data) {
        return /linear|radial/.test(data)
      },
      fix: false,
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
        color: {
          type: 'color',
          requried: false,
        },
        gradient: {
          type: 'Gradient',
          requried: false,
        },
      },
    }
    dataValidation.register('TextColor', textColorConfig)
    dataValidation.register('Gradient', gradientConfig)

    const obj: FTextColor = {
      color_type: 'gradient',
      gradient: {
        gradient_angle: 0,
        gradient_type: 'linear',
        stops: [],
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
      },
      fix: false,
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
        stops: [],
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
        stops: stops => {
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
              },
            }
          }
          return rules
        },
      },
    }
    const textColorConfig: TDataValidationConfig<FTextColor, BTextColor> = {
      rules: {
        color_type: ['solid', 'gradient'],
        color: {
          type: 'string',
          requried: false,
        },
        gradient: {
          type: 'Gradient',
          requried: false,
        },
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
        },
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
        stops: ['stop1', 'stop2'],
      },
    })
    expect(test1.result).toEqual(true)

    const test2 = verify({
      color_type: 'gradient',
      gradient: {
        gradient_angle: 10,
        gradient_type: 'radial',
        stops: ['stop1', 'stop2'],
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

describe('DataValidation use-cache', () => {
  it('use simple', () => {
    const dataValidation = getDataValidation()
    dataValidation.meta.set('gradient_type', {
      verify(data) {
        return /linear|radial/.test(data)
      },
      fix: false,
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
      },
      fix: false,
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
      gradient: {},
    })
    expect(dataValidation.cache.maps.size).toEqual(2)
  })

  it('use rule nesting - no verify', () => {
    const dataValidation = getDataValidation()
    dataValidation.meta.set('gradient_type', {
      verify(data) {
        return /linear|radial/.test(data)
      },
      fix: false,
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

describe('DataValidation strict', () => {
  it('not strict', () => {
    const dataValidation = getDataValidation()
    const gradientConfig: TDataValidationConfig<FTextColor['gradient']> = {
      strict: false,
      rules: {
        gradient_angle: 'number',
        gradient_type: ['linear', 'radial'],
        stops: stops => {
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
              },
            }
          }
          return rules
        },
      },
    }
    const textColorConfig: TDataValidationConfig<FTextColor, BTextColor> = {
      strict: false,
      rules: {
        color_type: ['solid', 'gradient'],
        color: {
          type: 'string',
          requried: false,
        },
        gradient: {
          type: 'Gradient',
          requried: false,
        },
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
        },
      },
    }
    dataValidation.register('TextColor', textColorConfig)
    dataValidation.register('Gradient', gradientConfig)

    const { verify } = dataValidation.use('TextColor')

    const test = verify({
      color_type: 'solid',
      color: '111',
    })
    expect(test.result).toEqual(true)

    const test2 = verify({
      color_type: 'solid',
      gradient: {
        gradient_angle: 10,
        gradient_type: 'radial',
        stops: ['stop1', 'stop2'],
      },
    })
    expect(test2.result).toEqual(false)
    expect(test2.key).toEqual('color')
  })
  it('strict', () => {
    const dataValidation = getDataValidation()
    const gradientConfig: TDataValidationConfig<FTextColor['gradient']> = {
      strict: true,
      rules: {
        gradient_angle: 'number',
        gradient_type: ['linear', 'radial'],
        stops: stops => {
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
              },
            }
          }
          return rules
        },
      },
    }
    const textColorConfig: TDataValidationConfig<FTextColor, BTextColor> = {
      strict: true,
      rules: {
        color_type: ['solid', 'gradient'],
        color: {
          type: 'string',
          requried: false,
        },
        gradient: {
          type: 'Gradient',
          requried: false,
        },
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
        },
      },
    }
    dataValidation.register('TextColor', textColorConfig)
    dataValidation.register('Gradient', gradientConfig)

    const { verify } = dataValidation.use('TextColor')

    const test = verify({
      color_type: 'solid',
      color: '111',
    })
    expect(test.result).toEqual(true)

    const test2 = verify({
      color_type: 'solid',
      color: '111',
      gradient: {
        gradient_angle: 10,
        gradient_type: 'radial',
        stops: ['stop1', 'stop2'],
      },
    })
    expect(test2.result).toEqual(false)
    expect(test2.key).toEqual('gradient.gradient_angle')
  })
})
// --- end 验证数据完整性 ---

// --- start 数据自动修正 ---
describe('DataValidation fix', () => {
  it('fix meta base', () => {
    const dataValidation = getDataValidation()
    dataValidation.meta.set('Color', {
      verify(data) {
        return /rgba\(\d, \d*, \d*, \d*\)/.test(data)
      },
      fix() {
        return {
          result: true,
          value: defaultColor,
        }
      },
    })
    const gradientConfig: TDataValidationConfig<FTextColor['gradient']> = {
      strict: false,
      rules: {
        gradient_angle: 'number',
        gradient_type: ['linear', 'radial'],
        stops: stops => {
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
              },
            }
          }
          return rules
        },
      },
    }
    const textColorConfig: TDataValidationConfig<FTextColor, BTextColor> = {
      strict: false,
      rules: {
        color_type: ['solid', 'gradient'],
        color: {
          type: 'Color',
          requried: false,
        },
        gradient: {
          type: 'Gradient',
          requried: false,
        },
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
        },
      },
    }
    dataValidation.register('TextColor', textColorConfig)
    dataValidation.register('Gradient', gradientConfig)

    const { fix: textFix } = dataValidation.use('TextColor')

    const data = {
      color_type: 'solid',
      color: '111',
    }
    const test = textFix(data)
    expect(test.result).toEqual(true)
    expect(data.color).toEqual(defaultColor)

    dataValidation.meta.set('Color.background', {
      verify(data) {
        return parseStringToRgba(data).a === 1
      },
      fix(data) {
        const rgba = parseStringToRgba(data)
        rgba.a = 1
        return {
          result: true,
          value: rgbaToString(rgba),
        }
      },
    })
    const backgroundColorConfig: TDataValidationConfig<any, any> = {
      strict: false,
      rules: {
        color: 'Color.background',
      },
    }
    dataValidation.register('Background', backgroundColorConfig)

    const { fix: backgroundFix } = dataValidation.use('Background')
    const data2 = {
      color: defaultColor,
    }
    const test2 = backgroundFix(data2)
    expect(test2.result).toEqual(true)
    expect(data2.color).toEqual('rgba(0, 0, 0, 1)')
  })
  it('fix meta prerequisite', () => {
    const dataValidation = getDataValidation()
    dataValidation.meta.set('Color', {
      prerequisites: 'string',
      verify(data) {
        return /rgba\(\d, \d*, \d*, \d*\)/.test(data)
      },
      fix() {
        return {
          result: true,
          value: defaultColor,
        }
      },
    })
    dataValidation.meta.set('BackgroundColor', {
      prerequisites: ['Color'],
      verify(data) {
        return parseStringToRgba(data).a === 1
      },
      fix(data) {
        const rgba = parseStringToRgba(data)
        rgba.a = 1
        return {
          result: true,
          value: rgbaToString(rgba),
        }
      },
    })
    const backgroundColorConfig: TDataValidationConfig<any, any> = {
      strict: false,
      rules: {
        color: 'BackgroundColor',
      },
    }
    dataValidation.register('Background', backgroundColorConfig)

    const { fix: backgroundFix } = dataValidation.use('Background')
    const data = {
      color: 'x',
    }

    const test = backgroundFix(data)
    expect(test.result).toEqual(true)
    expect(data.color).toEqual('rgba(0, 0, 0, 1)')

    const test2 = backgroundFix({
      color: 1,
    })
    expect(test2.result).toEqual(false)
    expect(test2.key).toEqual('color')

    dataValidation.meta.set('Color-NoFix', {
      prerequisites: ['string'],
      verify(data) {
        return /rgba\(\d, \d*, \d*, \d*\)/.test(data)
      },
      fix: false,
    })
    dataValidation.meta.set('BackgroundColor-Nofix', {
      prerequisites: ['Color-NoFix'],
      verify(data) {
        return parseStringToRgba(data).a === 1
      },
      fix(data) {
        const rgba = parseStringToRgba(data)
        rgba.a = 1
        return {
          result: true,
          value: rgbaToString(rgba),
        }
      },
    })
    const backgroundColorConfig2: TDataValidationConfig<any, any> = {
      strict: false,
      rules: {
        color: 'BackgroundColor-Nofix',
      },
    }
    dataValidation.register('Background2', backgroundColorConfig2)
    const { fix: backgroundFix2 } = dataValidation.use('Background2')

    const test3 = backgroundFix2({
      color: 'x',
    })
    expect(test3.result).toEqual(false)
    expect(test3.key).toEqual('color')
  })
  it('fix config base', () => {
    const dataValidation = getDataValidation()
    const backgroundColorConfig: TDataValidationConfig<any, any> = {
      strict: false,
      rules: {
        color: 'undefined',
      },
      fixes: {
        color(color) {
          if (color === defaultBackgroundColor) {
            return {
              result: true,
              value: true,
            }
          } else {
            return {
              result: false,
            }
          }
        },
      },
    }
    dataValidation.register('Background', backgroundColorConfig)

    const { fix } = dataValidation.use('Background')
    const data = {
      color: defaultBackgroundColor,
    }
    const test = fix(data)
    expect(test.result).toEqual(true)
    expect(data.color).toEqual(true)

    const defaultTestColor = 'ss'

    data.color = defaultTestColor
    const test2 = fix(data)
    expect(test2.result).toEqual(false)
    expect(test2.key).toEqual('color')
    expect(data.color).toEqual(defaultTestColor)
  })
})
// --- end 数据自动修正 ---

// --- start 数据更新 ---
describe('DataValidation update', () => {})
// --- end 数据更新 ---

function getDataValidation() {
  return new DataValidation({ isSecurity: true })
}

function makeRgbaByArray(arr) {
  return {
    r: arr[0],
    g: arr[1],
    b: arr[2],
    a: arr.length > 3 ? arr[3] : 1,
  }
}

function parseStringToRgba(input) {
  input = input.replace('\u3002', '\u002e')
  const matches = /rgba\((.*)\)/i.exec(input)
  if (matches) {
    const colorSegs = matches[1].split(',').map(s => parseFloat(s))
    const rgba = makeRgbaByArray(colorSegs)
    return rgba
  }
}

function rgbaToString(c) {
  return `rgba(${c.r}, ${c.g}, ${c.b}, ${c.a})`
}