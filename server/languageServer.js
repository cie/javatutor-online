import child_process from 'child_process'
import { Random } from 'meteor/random'
import LSPRouter from './lspRouter'
import { SIGINT } from 'constants'

let lsp, router
const pendingMessages = {}
let incomingBuffer = ''
const publications = {}

Meteor.startup(() => {
  lsp = child_process.spawn(
    'cd ~/git/eclipse.jdt.ls/org.eclipse.jdt.ls.product/target/products/languageServer.product/linux/gtk/x86_64 && java -Declipse.applicatn=org.eclipse.jdt.ls.core.id1 -Dosgi.bundles.defaultStartLevel=4 -Declipse.product=org.eclipse.jdt.ls.core.product -Dlog.level=ALL -jar plugins/org.eclipse.equinox.launcher_1.5.800.v20200727-1323.jar',
    {
      shell: true,
      env: { ...process.env, syntaxserver: 'false' }
    }
  )
  lsp.stdout.on('data', data => {
    incomingBuffer += data.toString()
    while (incomingBuffer) {
      let m = incomingBuffer.match(/Content-Length: (\d+)\r\n\r\n/)
      if (!m) return
      const index = m[0].length
      const contentLength = +m[1]
      if (incomingBuffer.length < index + contentLength) return
      const messageStr = incomingBuffer.slice(index, index + contentLength)
      incomingBuffer = incomingBuffer.slice(index + contentLength)

      try {
        router.receivedFromServer(JSON.parse(messageStr))
      } catch (e) {
        console.error(e)
      }
    }
  })
  router = new LSPRouter({
    sendToServer(message) {
      const str = JSON.stringify(message)
      const contentLength = str.length
      lsp.stdin.write(`Content-Length: ${contentLength}\r\n\r\n${str}`)
    },
    sendToClient(client, message) {
      if (!publications[client]) {
        console.log('Cannot send to ' + client)
        return
      }
      const _id = Random.id()
      publications[client].added('LSPMessages', _id, { message })
    }
  })
})

const close = () => {
  if (lsp) lsp.kill()
}
process.on('exit', close)
process.on('SIGINT', close)

Meteor.publish('LSPMessages', function () {
  router.clientConnected(this.connection.id)
  publications[this.connection.id] = this
  this.connection.onClose(() => {
    router.clientDisconnected(this.connection.id)
    delete publications[this.connection.id]
  })
})

Meteor.methods({
  async sendLSPMessage(message) {
    router.receivedFromClient(this.connection.id, message)
  }
})
