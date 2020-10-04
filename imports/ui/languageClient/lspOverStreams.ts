import { ClientStream } from 'meteor/mmack:m-stream'
import { createMessageConnection } from 'vscode-jsonrpc'
import { AbstractMessageReader } from 'vscode-jsonrpc/lib/messageReader'

export function lspOverStreamsMessageConnection(id) {
  const stream = new ClientStream(`lsp-${id}`)
  return createMessageConnection(
    new MessageReader(stream),
    new MessageWriter(stream)
  )
}

class MessageReader extends AbstractMessageReader {
  constructor(stream) {
    super()
    this.stream = stream
  }
  listen(callback) {
    this.callback = callback
    this.stream.on('message', message => {
      callback(message)
    })
  }
}

class MessageWriter extends AbstractMessageWriter {
  stream: ClientStream
  constructor(stream) {
    super()
    this.stream = stream
  }
  write(message) {
    this.stream.emit('message', message)
  }
}
