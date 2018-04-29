import xs from 'xstream'
import browserify from 'browserify'
import log from './log'
import fs from 'fs'
import path from 'path'

export default client => {
  const bundle$ = xs.createWithMemory()
  let bundleString = []
  const bundleStream = browserify()
    .transform('babelify')
    // .transform({ global: true }, 'uglifyify')
    .add(client)
    .bundle()

  bundleStream.on('data', data => bundleString.push(data))
  bundleStream.on('end', () => {
    const buffer = Buffer.concat(bundleString).toString()
    return fs.writeFile(path.join(__dirname, '..', 'public', 'bundle.js'), buffer, () => {
      bundle$.shamefullySendNext('/public/bundle.js')
      log.info('Client bundle successfully compiled')
    })
  })

  return bundle$
}


