import winston from 'winston'
const logLevel = process.env.LOG_LEVEL || 'debug'

winston.level = logLevel
winston.addColors({
  silly: 'magenta',
  debug: 'blue',
  verbose: 'cyan',
  info: 'green',
  warn: 'yellow',
  error: 'red'
})
winston.remove(winston.transports.Console)
winston.add(winston.transports.Console, {
  level: logLevel,
  prettyPrint: true,
  colorize: 'all',
  silent: false,
  timestamp: true
})

winston.info('Logger\'s inited')

export default winston
