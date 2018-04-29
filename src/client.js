import xs from 'xstream'
import { always } from 'ramda'
import { run } from '@cycle/run'
import { makeDOMDriver } from '@cycle/dom'
import { makeHTTPDriver } from '@cycle/http'
import { makeRouterDriver } from 'cyclic-router'
import { createBrowserHistory } from 'history'
import preventDefaultDriver from './drivers/prevent_default'
import switchPath from 'switch-path'
import app from './app'

const main = sources => {
  const sinks = app(sources)
  return sinks
}

const drivers = {
  DOM: makeDOMDriver('#root'),
  CONTEXT: always(xs.of(window.__APP_CONTEXT__)),
  ROUTER: makeRouterDriver(createBrowserHistory(), switchPath),
  PREVENT_DEFAULT: preventDefaultDriver,
  HTTP: makeHTTPDriver()
}

run(main, drivers)
