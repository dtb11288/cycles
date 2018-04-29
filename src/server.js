import { pipe, always, prop, cond, pick, T } from 'ramda'
import runServer from './lib/run'
import { run } from '@cycle/run'
import xs from 'xstream'
import makeServerDriver from './drivers/http'
import makeLogDriver from './drivers/log'
import makeDBDriver from './drivers/db'
import app from './app'
import { makeHTMLDriver } from '@cycle/html'
import { makeHTTPDriver } from '@cycle/http'
import { makeRouterDriver } from 'cyclic-router'
import { createMemoryHistory } from 'history'
import switchPath from 'switch-path'
import bundle from './lib/bundle'
import wrapApp from './lib/wrap'
import path from 'path'

const host = '0.0.0.0'
const port = 1337

const clientBundle$ = bundle(path.join(__dirname, 'client.js'))

const prependHTML5Doctype = html => `<!doctype html>${html}`

const handleHTMLRequest = sources => req => {
  const context$ = xs.of(pick(['uri', 'query', 'protocol', 'host'], req))
  const wrappedApp = wrapApp(app, context$, clientBundle$)
  const html$ = xs.never()
  run(wrappedApp, {
    DOM: makeHTMLDriver(pipe(
      prependHTML5Doctype,
      html => ({ headers: { 'Content-Type': 'text/html' }, body: html }),
      html => html$.shamefullySendNext(html)
    )),
    CONTEXT: always(context$),
    PREVENT_DEFAULT: () => {},
    ROUTER: makeRouterDriver(createMemoryHistory({ initialEntries: [ req.url ] }), switchPath),
    HTTP: makeHTTPDriver()
  })

  return { SERVER: html$ }
}

const handleGETRequest = sources => cond([
  [({ url }) => url === '/favicon.ico', always({ SERVER: xs.of({ headers: { 'Content-Type': 'image/x-icon' } }) })],
  [({ url }) => /\/public\/(.+)/.test(url), req => ({ SERVER: xs.of({ staticUrl: req.url }) })],
  [T, handleHTMLRequest(sources)]
])

const handleGraphQLRequest = sources => req => {
  return { SERVER: xs.of({ headers: { 'Content-Type': 'application/json' }, json: true, body: { graphql: true } }) }
}

const handleUploadRequest = sources => req => {
  return { SERVER: xs.of({ headers: { 'Content-Type': 'application/json' } }) }
}

const handlePOSTRequest = sources => cond([
  [({ url }) => url === '/graphql', handleGraphQLRequest(sources)],
  [({ url }) => url === '/upload', handleUploadRequest(sources)],
  [T, ({ url }) => ({ SERVER: xs.of({ status: 500, body: `Invalid POST request: ${url}` }) })]
])

const handleRequest = sources => cond([
  [({ method }) => method === 'GET', handleGETRequest(sources)],
  [({ method }) => method === 'POST', handlePOSTRequest(sources)],
  [T, ({ method }) => ({ SERVER: xs.of({ status: 500, body: `Invalid request method: ${method}` }) })]
])

const main = sources => {
  const handleResponse$ = sources.SERVER.map(handleRequest(sources))
  const response$ = handleResponse$.map(prop('SERVER')).flatten()
  const db$ = xs.of({ name: 'test' })
  const log$ = sources.SERVER
    .filter(req => req.url !== '/favicon.ico')
    .map(({ method, url }) => ({ info: `Making ${method} request to ${url}` }))

  return {
    DB: db$,
    LOG: log$,
    SERVER: response$
  }
}

const drivers = {
  DB: makeDBDriver('./db.sqlite3'),
  LOG: makeLogDriver(),
  SERVER: makeServerDriver(host, port)
}

runServer(main, drivers)
