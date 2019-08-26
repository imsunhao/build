import { TextColor as BTextColor } from './src/back'
import { TextColor as FTextColor } from './src/front'
import { TDataValidationConfig, DataValidation } from './src/index'

const dataValidation = DataValidation.getInstance()

describe('DataValidation verify', () => {
  it('gradient function false', () => {
    const testConfig: TDataValidationConfig<FTextColor, BTextColor> = {
      name: 'TextColor',
      source: {
        color_type: 'string',
        color: 'string',
        gradient: () => false,
      },
    }
    const obj: FTextColor = {
      color_type: 'solid',
    }
    dataValidation.config.set(testConfig)
    const { verify } = dataValidation.use('TextColor')
    const { result, key } = verify(obj)
    expect(result).toEqual(false)
    expect(key).toEqual('gradient')
  })
})
