import { merge } from 'ramda'
const makeStateDriver = (initState = {}) => sink$ => sink$.fold(merge)

export { makeStateDriver }
