import xs from 'xstream'

export default sources => ({
  DOM: xs.of('Not Found'),
  HTTP: xs.empty(),
  ROUTER: xs.empty(),
  PREVENT_DEFAULT: xs.empty()
})
