var s = {}
try {
  var env = ['NODE_ENV', 'SERVER_ENV'].reduce(function(obj, key) {
    obj[key] = process.env[key]
    return obj
  }, {})
  var isProduction = env.NODE_ENV === 'production'
  var isLocal = env.SERVER_ENV === 'local'
  var isRead = !(!isProduction || (isProduction && isLocal))

  /**
   * 要求 node版本 10以上
   */
  s = new Proxy(function() { return s }, {
    get(target, name) {
      if (!isRead) {
        if (name === '__esModule' || typeof name === 'symbol' || name === 'name') {
          return 'empty-module.js'
        }
        // isRead = true
        console.warn('exclude-server: 存在包试图在server端被调用,请自行检查. 访问属性名称 =', name)
      }
      return s
    },
    set(target, property, value, receiver) {
      return
    },
  })
} catch (error) {
  console.error('exclude server error:', error)
}

module.exports = s