import xs from 'xstream'
import pageLayout from '../../layouts/page'
import { section, p, h1 } from '@cycle/dom'

function renderHomePage (layout) {
  return (
    section('.home', [
      h1('The homepage'),
      p('Welcome to our spectacular web page with nothing special here.'),
      layout
    ])
  )
}

export default sources => {
  const layout = pageLayout(sources)
  const home$ = layout.HTTP
    .map(renderHomePage)

  return {
    DOM: home$,
    HTTP: xs.empty(),
    ROUTER: layout.ROUTER,
    PREVENT_DEFAULT: layout.PREVENT_DEFAULT
  }
}
