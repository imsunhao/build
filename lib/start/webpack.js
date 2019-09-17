const path = require('path')
const _ = require('lodash')
const config = _.cloneDeep(require('../../webpack'))
const resolve = p => path.resolve(__dirname, '../../', p)

config.entry = {
  start: resolve('./src/bin/start.ts')
}
config.output.path = resolve('./lib/start/dist')

module.exports = config
