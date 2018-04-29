import knex from 'knex'
import xs from 'xstream'

export default dbFile => {
  const connection = knex({
    client: 'sqlite3',
    connection: { filename: dbFile },
    useNullAsDefault: true
  })

  const read$ = xs.create()
    .map(a => { console.log(a); return a })

  return {
    write: con$ => con$.subscribe({
      next: handleQuery(connection, read$)
    }),
    read: read$
  }
}

const handleQuery = (knex, output$) => ({ query, name, options }) => {
  // output$.shamefullySendNext({ name, result: [] })
}
