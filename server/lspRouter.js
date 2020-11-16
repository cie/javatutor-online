import traverse from 'traverse'

export default class LSPRouter {
  constructor({
    sendToServer,
    sendToClient,
    getWorkspaceFolder,
    workspaceFolderRegExp
  }) {
    this.sendToServer = sendToServer
    this.sendToClient = sendToClient
    this.getWorkspaceFolder = getWorkspaceFolder
    this.workspaceFolderRegExp = workspaceFolderRegExp
    this.clientToServerCalls = []
    this.serverToClientCalls = {}
    this.broadcastMessages = []
    this.workspaceFolders = {}
    this.clients = {}
    this.initializeId = null
    this.initializedId = null
    this.initializeResponse = null
    this.initializedResponse = null
  }
  receivedFromServer(message) {
    let client
    message = convertURIs(message, uri =>
      uri.replace(this.workspaceFolderRegExp, folder => {
        client = this.workspaceFolders[folder]
        return 'workspace:'
      })
    )
    if ('result' in message)
      if (message.id === this.initializeId) this.initializeDone(message)
      else if (message.id === this.initializedId) this.initializedDone(message)
      else this.returnFromServer(message)
    else if ('method' in message)
      if (
        message.method === 'window/logMessage' ||
        message.method === 'language/status'
      ) {
        console.log(message.params.message)
      } else if (message.method === 'client/registerCapability')
        this.broadcast(message)
      else if (message.method === 'textDocument/publishDiagnostics' && client)
        this.callToClient(client, message)
      else console.log('unknown call from server', message)
    else console.log('sth different from server', message)
  }
  receivedFromClient(client, message) {
    message = convertURIs(message, uri =>
      uri.replace(/^workspace:/, this.findWorkspaceFolder(client))
    )
    if ('method' in message && !message.method.startsWith('$/'))
      if (message.method === 'initialize') this.initialize(client, message)
      else if (message.method === 'initialized')
        this.initialized(client, message)
      else this.callToServer(client, message)
    else if ('result' in message) this.returnFromClient(client, message)
    else console.log('sth different fron client', client, message)
  }
  findWorkspaceFolder(client) {
    if (!this.clients[client]) this.clients[client] = {}
    if (this.clients[client].folder) return this.clients[client].folder
    const folder = this.getWorkspaceFolder(client)
    this.clients[client].folder = folder
    this.workspaceFolders[folder] = client
    return folder
  }
  clientConnected(client) {}
  clientDisconnected(client) {
    delete this.clients[client]
  }
  initialize(client, message) {
    //console.log('initialize', client, message)
    if (this.initializeId === null) {
      this.initializeId = this.callToServer(client, message)
    } else {
      this.sendToClient(client, this.initializeResponse)
    }
  }
  initializeDone(message) {
    this.initializeResponse = message
    const client = this.returnFromServer(message)
  }
  initialized(client, message) {
    console.log('initialized', client, message)
    if (this.initializedId === null) {
      this.initializedId = this.callToServer(client, message)
    } else {
      this.sendToClient(client, { id: message.id, result: null })
      for (const message of this.broadcastMessages)
        this.callToClient(client, message)
    }
  }
  initializedDone(message) {
    console.log('initializedDone', message)
    this.initializedResponse = message
    const client = this.returnFromServer(message)
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
    if (!message.hasOwnProperty('id')) {
      this.sendToClient(client, message)
      //console.log('sendToClient', client, message)
      return
    }
    if (!this.serverToClientCalls[client]) this.serverToClientCalls[client] = []
    const id = this.serverToClientCalls[client].push(message.id) - 1
    this.sendToClient(client, { ...message, id })
    //console.log('sendToClient', client, { ...message, id })
  }
  returnFromClient(client, message) {
    const sid = this.serverToClientCalls[client][message.id]
    this.sendToServer({ ...message, id: sid })
    //console.log('sendToServer', { ...message, id: sid })
  }
  broadcast(message) {
    for (const client of Object.keys(this.clients))
      this.callToClient(client, message)
    this.broadcastMessages.push(message)
  }
}

function convertURIs(message, convertURI) {
  return traverse(message).map(function (value) {
    if (
      typeof value === 'string' &&
      typeof this.key === 'string' &&
      this.key.match(/uri$/i)
    ) {
      this.update(convertURI(value))
    }
  })
}
