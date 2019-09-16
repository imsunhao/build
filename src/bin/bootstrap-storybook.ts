import { BuildService } from '@types'

import consola from 'consola'
import rimraf from 'rimraf'
import { resolve } from 'path'
import { writeFileSync } from 'fs'
import { getUserConfigSync } from 'src/utils'

export function bootstrapStorybook(argv: BuildService.parsedArgs) {
  consola.info('clear cache')
  const rootDir = resolve(argv._[0] || '.')
  const storybookRootDir = resolve(argv._[0] || '.storybook')
  const storybookConfigPath = resolve(storybookRootDir, './storybook.build.config')

  rimraf.sync(storybookConfigPath)

  const config = getUserConfigSync('development', argv)

  delete config.webpack

  config.mode = process.env.NODE_ENV

  const template = `#!/usr/bin/env node
const path = require('path')
const rootDir = '${rootDir}'
const resolve = function (p) {
  return path.resolve(rootDir, p)
}

const config = ${JSON.stringify(config, null, 2)}

config.resolve = resolve

module.exports = config
  `

  writeFileSync(storybookConfigPath, template, 'utf8')
}
