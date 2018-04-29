import xs from 'xstream'
import { a, ul, li } from '@cycle/dom'

function renderMenu () {
  return (
    ul([
      li([ a('.link', {attrs: {href: '/page'}}, 'Home') ]),
      li([ a('.link', {attrs: {href: '/admin'}}, 'About') ])
    ])
  )
}

export default sources => {
  const click$ = sources.DOM.select('.link').events('click')
  return {
    DOM: xs.of(renderMenu),
    HTTP: xs.empty(),
    ROUTER: click$.map(e => e.target.pathname),
    PREVENT_DEFAULT: click$
  }
}
