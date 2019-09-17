const webpack = require('webpack')
const config = require('../webpack')
const startConfig = require('../lib/start/webpack')

const mainCompiler = webpack(config)

mainCompiler.watch({}, (err, stats) => {
  console.log('---------- mainCompiler ------------')
  console.log(stats.toString({ colors: true }))
})

const startCompiler = webpack(startConfig)
startCompiler.watch({}, (err, stats) => {
  console.log('---------- startCompiler ------------')
  console.log(stats.toString({ colors: true }))
})