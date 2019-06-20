const config = require('../.eslintrc')

Object.assign(config.globals, {
  describe: true,
  test: true,
  it: true,
  expect: true,
  beforeAll: true,
  beforeEach: true,
  afterAll: true,
  afterEach: true,
  jest: true,
})

module.exports = config
