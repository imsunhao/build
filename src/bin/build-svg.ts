import { BuildService } from '@types'
import consola from 'consola'
import { svgBuild } from 'src/build'
import { simpleInitConfig } from 'src/utils'

async function buildMain(argv: BuildService.parsedArgs) {
  consola.ready(`@bestminr/build-svg v${argv.version}`)
  consola.start('start with SPRITE mode')
  const options = await simpleInitConfig(argv, 'svg')

  svgBuild()

  // const webpack: any = options.webpack
  // const svgConfig = webpack.svg
  // console.log('-------------------------------------')
  // console.log('svgConfig', JSON.stringify(svgConfig, null, 2))
  // console.log('-------------------------------------')
  // delete options.webpack
  // console.log('options', JSON.stringify(options, null, 2))
  // console.log('-------------------------------------')
}

export { buildMain as start }