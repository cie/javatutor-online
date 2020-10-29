export default class LSPRouter {
  constructor({ sendToServer, sendToClient }) {
    this.sendToServer = sendToServer
    this.sendToClient = sendToClient
    this.clientToServerCalls = []
    this.serverToClientCalls = {}
    this.broadcastedMessages = []
    this.clients = {}
    this.initializeId = null
    this.initializeResponse = null
  }
  receivedFromServer(message) {
    if ('result' in message)
      if (message.id === this.initializeId) this.initialized(message)
      else this.returnFromServer(message)
    else if ('method' in message)
      if (
        message.method === 'window/logMessage' ||
        message.method === 'language/status'
      )
        console.log(message.params.message)
      else if (message.method === 'client/registerCapability')
        this.broadcast(message)
      else console.log('unknown call from server', message)
    else console.log('sth different from server', message)
  }
  receivedFromClient(client, message) {
    if ('method' in message && !message.method.startsWith('$/'))
      if (message.method === 'initialize') this.initialize(client, message)
      else this.callToServer(client, message)
    else if ('result' in message) this.returnFromClient(client, message)
    else console.log('sth different fron client', client, message)
  }
  clientConnected(client) {}
  clientDisconnected(client) {
    delete this.clients[client]
  }
  initialize(client, message) {
    console.log('initialize', client, message)
    if (this.initializeId === null) {
      this.initializeId = this.callToServer(client, message)
    } else {
      this.sendToClient(client, this.initializeResponse)
      for (const message of this.broadcastedMessages)
        this.callToClient(client, message)
    }
  }
  initialized(message) {
    this.initializeResponse = message
    const client = this.returnFromServer(message)
    this.clients[client] = {}
    for (const message of this.broadcastedMessages)
      this.callToClient(client, message)
  }
  callToServer(client, message) {
    const sid = this.clientToServerCalls.push({ client, id: message.id }) - 1
    this.sendToServer({ ...message, id: sid })
    //console.log('sendToServer', { ...message, id: sid })
    return sid
  }
  returnFromServer(message) {
    const { client, id } = this.clientToServerCalls[message.id]
    this.sendToClient(client, { ...message, id })
    //console.log('sendToClient', client, { ...message, id })
    return client
  }
  callToClient(client, message) {
    if (!this.serverToClientCalls[client]) this.serverToClientCalls[client] = []
    const id = this.serverToClientCalls[client].push(message.id) - 1
    this.sendToClient(client, { ...message, id })
    console.log('sendToClient', client, { ...message, id })
  }
  returnFromClient(client, message) {
    const sid = this.serverToClientCalls[client]
    this.sendToServer({ ...message, id: sid })
    console.log('sendToServer', { ...message, id: sid })
  }
  broadcast(message) {
    for (const client of Object.keys(this.clients))
      this.callToClient(client, message)
    this.broadcastedMessages.push(message)
  }
}
