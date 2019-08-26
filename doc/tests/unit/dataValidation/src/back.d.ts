export * from './base'

export type Gradient = GradientBase & {
  /**
   * 该位置颜色
   * * 是否必填: true
   * * 允许为空: false
   */
  color: string
}

export type GradientColor = GradientColorBase & {
  /**
   * 渐变色
   */
  stops?: Gradient[]
}

export type TextColor = TextColorBase & {
  gradient?: GradientColor
}
