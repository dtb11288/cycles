import xs from 'xstream'
import { map, toPairs, pipe, propOr, identity } from 'ramda'

export default (main, effects) => {
  const sources$ = map(propOr(xs.of(), 'read'), effects)
  const sinks = main(sources$)
  return pipe(
    toPairs,
    map(([key, driver]) => (driver.write || identity)(sinks[key]))
  )(effects)
}
