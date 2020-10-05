import ClientStream from 'meteor/mmack:m-stream'
import { createMessageConnection } from 'vscode-jsonrpc'
import { AbstractMessageReader } from 'vscode-jsonrpc/lib/messageReader'
import { AbstractMessageWriter } from 'vscode-jsonrpc/lib/messageWriter'

export function lspOverStreamsMessageConnection(id) {
  const stream = (window.stream = new ClientStream(`lsp-${id}`))
  stream.init()
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
    this.stream.on('down', message => {
      callback(message)
    })
  }
}

class MessageWriter extends AbstractMessageWriter {
  constructor(stream) {
    super()
    this.stream = stream
  }
  write(message) {
    this.stream.emit('up', message)
  }
}
