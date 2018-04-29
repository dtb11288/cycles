import xs from 'xstream'
import pageLayout from '../../layouts/page'
import { h1, section, p } from '@cycle/dom'

function renderAboutPage (layout) {
  return (
    section('.about', [
      h1('Read more about us'),
      p('This is the page where we describe ourselves.'),
      p('Contact us'),
      layout
    ])
  )
}

export default sources => {
  const layout = pageLayout(sources)
  const about$ = layout.HTTP

  return {
    DOM: about$,
    HTTP: xs.empty(),
    ROUTER: layout.ROUTER,
    PREVENT_DEFAULT: layout.PREVENT_DEFAULT
  }
}
