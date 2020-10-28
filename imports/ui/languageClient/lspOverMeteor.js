import { createMessageConnection } from 'vscode-jsonrpc'
import { AbstractMessageReader } from 'vscode-jsonrpc/lib/messageReader'
import { AbstractMessageWriter } from 'vscode-jsonrpc/lib/messageWriter'

export function lspOverMeteorMessageConnection() {
  const reader = new MessageReader()
  return createMessageConnection(reader, new MessageWriter(reader))
}

const LSPMessages = new Meteor.Collection('LSPMessages')
Meteor.subscribe('LSPMessages')

class MessageReader extends AbstractMessageReader {
  listen(callback) {
    this.callback = callback
    LSPMessages.find().observe({
      added: ({ _id, message }) => {
        this.callback(JSON.parse(message))
      }
    })
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
    Meteor.call('sendLSPMessage', message)
  }
}
