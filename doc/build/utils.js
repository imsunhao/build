import path from 'path'
import config from '../config'
import HappyPack from 'happypack'
import webpack from 'webpack'

export function assetsPath(_path) {
  return path.posix.join(config.assetsSubDirectory, _path)
}

export function makeHappyPack(id, loaders) {
  return new HappyPack({
    id: id,
    threads: 4,
    loaders: loaders
  })
}

export const resolve = (p) => path.resolve(__dirname, '..', p)

export function makeDllPlugins(nameArr) {
  const plugins = []
  nameArr.forEach((name) => {
    plugins.push(
      new webpack.DllReferencePlugin({
        // context: resolve('.'),
        // manifest: config.isProd ? require(`../dist/build/dll/${name}.manifest.json`) : require(`../dist/dll/${name}.manifest.json`)
        manifest: require(resolve(`${config.assetRoot}/dll/${name}.manifest.json`)),
      })
    )
  })
  return plugins
}
