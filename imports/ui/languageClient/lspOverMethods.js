import { createMessageConnection } from 'vscode-jsonrpc'
import { AbstractMessageReader } from 'vscode-jsonrpc/lib/messageReader'
import { AbstractMessageWriter } from 'vscode-jsonrpc/lib/messageWriter'

export function lspOverMethodsMessageConnection() {
  const reader = new MessageReader()
  return createMessageConnection(reader, new MessageWriter(reader))
}

class MessageReader extends AbstractMessageReader {
  listen(callback) {
    this.callback = callback
  }
  onResponse(message) {
    this.callback(message)
  }
}

class MessageWriter extends AbstractMessageWriter {
  constructor(reader) {
    super()
    this.reader = reader
  }
  write(message) {
    Meteor.call('lsp', message, (err, response) => {
      if (err) return this.reader.onError(err)
      this.reader.onResponse(response)
    })
  }
}
