const parseArgs = require('minimist')
const consola = require('consola')
const { version } = require('../package.json')

function getArgv() {
  const argv = parseArgs(process.argv.slice(2), {
    alias: {
      H: 'hostname',
      p: 'port',
      h: 'help',
      d: 'dll',
      c: 'config-file',
      cl: 'clear',
      v: 'version'
    },
    boolean: ['h', 'd', 'v', 'cl'],
    string: ['H', 'c'],
    default: {
      c: 'build.config.ts'
    }
  })

  if (argv.version) {
    process.stderr.write(version + '\n')
    process.exit(0)
  }

  if (argv.hostname === '') {
    consola.fatal('Provided hostname argument has no value')
  }

  if (argv.clear) {
    consola.info('clear cache')
    const rimraf = require('rimraf')
    const resolve = require('path').resolve
    path = resolve(argv._[0] || './.build')
    rimraf.sync(path)
  }

  if (argv.help) {
    process.stderr.write(`
      Description
        Starts the application in ${process.env.NODE_ENV} mode
      Options
        --port, -p          A port number on which to start the application
        --hostname, -H      Hostname on which to start the application
        --clear, --cl       clear cache
        --dll, -d           build webpack dll
        --version, -v       look over version
        --config-file, -c   Path to config file (default: build.config.ts)
        --help, -h          Displays this message
  `)
    process.exit(0)
  }

  argv.version = version

  return argv
}

module.exports = {
  getArgv
}