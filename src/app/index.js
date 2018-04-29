import { prop, evolve } from 'ramda'
import routes from './routes'

export default sources => {
  const match$ = sources.ROUTER.define(routes).debug()
  const response$ = match$.map(({ path, value }) => {
    return value(evolve({
      ROUTER: r$ => r$.path(path)
    }, sources))
  })

  return {
    DOM: response$.map(prop('DOM')).flatten(),
    HTTP: response$.map(prop('HTTP')).flatten(),
    ROUTER: response$.map(prop('ROUTER')).flatten(),
    PREVENT_DEFAULT: response$.map(prop('PREVENT_DEFAULT')).flatten()
  }
}
