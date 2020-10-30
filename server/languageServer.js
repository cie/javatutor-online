import child_process from 'child_process'
import { Random } from 'meteor/random'
import LSPRouter from './lspRouter'

const lspDir = Meteor.isDevelopment
  ? '../../../../../docker/org.eclipse.jdt.ls'
  : '/opt/org.eclipse.jdt.ls'

let lsp, router, workspace
let incomingBuffer = ''
const publications = {}

Meteor.startup(() => {
  Meteor.settings.public.workspace = workspace
  lsp = child_process.spawn(
    `cd ${lspDir} &&
     java -Declipse.applicatn=org.eclipse.jdt.ls.core.id1 -Dosgi.bundles.defaultStartLevel=4 -Declipse.product=org.eclipse.jdt.ls.core.product -Dlog.level=ALL -jar plugins/org.eclipse.equinox.launcher_1.5.800.v20200727-1323.jar`,
    {
      shell: true,
      stdio: ['pipe', 'pipe', 'pipe'],
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
  lsp.stderr.on('data', data => {
    console.error(data.toString())
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
      publications[client].added('LSPMessages', _id, {
        message: JSON.stringify(message)
      })
    },
    getWorkspaceFolder(client) {
      const tmp = require('tmp').dirSync().name
      child_process.execSync(
        `cp -R ${lspDir}/workspace/asdf ${tmp} && chmod -R u=rwX ${tmp}`
      )
      return `file://${tmp}/asdf/src/`
    },
    workspaceFolderRegExp: /^file:\/\/.*\/asdf\/src\//
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
