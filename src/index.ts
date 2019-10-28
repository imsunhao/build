import { ConfigOptions } from '@types'
import { setWebpackSync } from 'src/utils'
import consola from 'consola'

/**
 * 使用现有的注入数据来解析用户的配置文件
 * @param INJECT_CONTEXT 使用 yarn build-storybook 后, 生成的 .storybook/storybook.build.config
 * @param CONFIG 使用 yarn service:dev 后, 生成的 dist/xx/xx_config.js
 */
export function resoveBuildConfig(INJECT_CONTEXT, CONFIG) {
  if (!INJECT_CONTEXT || !INJECT_CONTEXT.rootDir) {
    consola.fatal('[resoveBuildConfig] INJECT_CONTEXT is', INJECT_CONTEXT)
    process.exit(1)
  }
  if (!CONFIG) {
    consola.fatal('[resoveBuildConfig] CONFIG is', CONFIG)
    process.exit(1)
  }
  CONFIG = CONFIG.default(INJECT_CONTEXT)
  // console.log('--------------------------')
  // console.dir(INJECT_CONTEXT, {
  //   depth: null
  // })
  // console.log('--------------------------')
  // console.dir(CONFIG, {
  //   depth: null
  // })
  // console.log('--------------------------')
  const options: ConfigOptions.options = CONFIG
  options.rootDir = INJECT_CONTEXT.rootDir
  options.injectContext = INJECT_CONTEXT.injectContext
  setWebpackSync(options, INJECT_CONTEXT.mode)
  // console.log('--------------------------')
  // console.dir(options, {
  //   depth: null
  // })
  // console.log('--------------------------')
  return options
}

export { initConfig } from 'src/utils'
