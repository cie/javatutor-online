import { ServerStream } from 'meteor/mmack:m-stream'

export function startLanguageServer(id) {
  const stream = new ServerStream(`lsp-${id}`)
  stream.on('message', msg => {
    console.log(msg)
  })
}
