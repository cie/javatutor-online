import ServerStream from 'meteor/mmack:m-stream'

export function startLanguageServer(id) {
  console.log(id + 'started stream')
  const stream = new ServerStream(`lsp-${id}`)
  stream.readPermission(
    (item, userId) => item.streamId === `lsp-${userId}` && item.subId === 'down'
  )
  stream.writePermission(
    (item, userId) => item.streamId === `lsp-${userId}` && item.subId === 'up'
  )
  stream.events.on('up', msg => {
    console.log(msg)
  })
}
