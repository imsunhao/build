import { BuildService } from '@types'
import consola from 'consola'
import { customBuild } from 'src/build'
import { customBuildInitConfig } from 'src/utils'

async function buildMain(argv: BuildService.parsedArgs) {
  consola.ready(`@bestminr/custom-build v${argv.version}`)
  consola.start('start with SPRITE mode')
  const options = await customBuildInitConfig(argv, 'development')

  customBuild()

  // const customBuildConfig: any = options.customBuild
  // console.log('-------------------------------------')
  // console.log('customConfig', JSON.stringify(customBuildConfig, null, 2))
  // console.log('-------------------------------------')
  // delete options.webpack
  // delete options.customBuild
  // console.log('options', JSON.stringify(options, null, 2))
  // console.log('-------------------------------------')
}

export { buildMain as start }