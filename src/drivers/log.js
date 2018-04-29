import log from '../lib/log'
import { pipe, toPairs, head, isNil, complement } from 'ramda'

export default () => ({
  write: log$ => log$.filter(complement(isNil)).subscribe({
    next: pipe(
      toPairs,
      head,
      ([type, logStr]) => log[type](logStr)
    )
  })
})
