export * from './base'

type Gradient = GradientBase & {
  /**
   * 该位置颜色
   * * 是否必填: true
   * * 允许为空: false
   */
  color: {
    r: number
    g: number
    b: number
    a: number
  }
}

type GradientColor = GradientColorBase & {
  /**
   * 渐变色
   */
  stops?: Gradient[]
}

export type TextColor = TextColorBase & {
  gradient?: GradientColor
}