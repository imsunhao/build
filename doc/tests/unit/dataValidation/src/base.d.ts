type GradientBase = {
  /**
   * 渐变色开始位置
   * * 是否必填: true
   * * 允许为空: false
   */
  position: number
}

type GradientColorBase = {
  /**
   * 渐变类型：线性渐变，径向渐变
   */
  gradient_type: 'linear' | 'radial'
  /**
   * 渐变色角度
   */
  gradient_angle?: number
}

type TextColorBase = {
  color_type: 'solid' | 'gradient'
  color?: string
}
