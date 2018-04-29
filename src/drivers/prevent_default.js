export default ev$ => {
  ev$.addListener({
    next: ev => ev.preventDefault()
  })
}
