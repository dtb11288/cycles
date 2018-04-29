import xs from 'xstream'
import serialize from 'serialize-javascript'
import { evolve } from 'ramda'
import { html, head, title, body, meta, div, script } from '@cycle/dom'

const wrapVTree = ([vtree, state, bundle]) => {
  return (
    html([
      head([
        title('Cycle serverside rendering!'),
        meta({ props: { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' } })
      ]),
      body([
        div('#root', [vtree]),
        script(`window.__INITIAL_STATE__ = ${serialize(state)};`),
        script({ props: { src: bundle } })
      ])
    ])
  )
}

const wrapApp = (app, context$, bundle$) => sources => {
  const sinks = app(sources)

  const http$ = xs.combine(sinks.HTTP, context$)
    .map(([request, { host, protocol }]) => evolve({
      url: url => `${protocol}://${host}${url}`
    }, request))

  const wrappedVDOM$ = xs.combine(sinks.DOM, context$, bundle$)
    .map(wrapVTree)

  return {
    DOM: wrappedVDOM$,
    ROUTER: sinks.ROUTER,
    HTTP: http$,
    PREVENT_DEFAULT: sinks.PREVENT_DEFAULT
  }
}

export default wrapApp
