import xs from 'xstream'
import { tryCatch, always } from 'ramda'
import qs from 'querystring'
import log from '../lib/log'
import http from 'http'
import fs from 'fs'
import path from 'path'

export default (host, port) => {
  let response
  const server = http.createServer()
  const server$ = xs.create({
    start: listener => server
      .on('request', (req, res) => {
        response = res
        let body = []
        return req
          .on('data', chunk => body.push(chunk))
          .on('end', () => {
            const [uri, qStr] = req.url.split('?')
            const request = {
              host: req.headers.host,
              protocol: 'http',
              method: req.method,
              body: tryCatch(body => JSON.parse(Buffer.concat(body).toString()), always({}))(body),
              url: req.url,
              uri,
              query: qs.parse(qStr),
              headers: req.headers
            }
            return listener.next(request)
          })
      }),
    stop: () => log.info('Server stopped')
  })

  server.listen(port, host, () => {
    log.info(`Server running at http://${host}:${port}`)
  })

  return {
    write: server$ => server$.subscribe({
      next: ({ status = 200, headers = {}, body = '', json = false, staticUrl }) => {
        if (staticUrl) {
          const fileStream = fs.createReadStream(path.join(__dirname, '..', staticUrl))
          fileStream.on('error', error => {
            log.warn(error.message)
            response.end('File not found')
          })
          return fileStream.pipe(response)
        }
        response.writeHead(status, headers)
        return response.end(json ? JSON.stringify(body) : body)
      }
    }),
    read: server$
  }
}
