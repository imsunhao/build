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
      v: 'version'
    },
    boolean: ['h', 'd', 'v'],
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

  if (argv.help) {
    process.stderr.write(`
      Description
        Starts the application in ${process.env.NODE_ENV} mode
      Options
        --port, -p          A port number on which to start the application
        --hostname, -H      Hostname on which to start the application
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