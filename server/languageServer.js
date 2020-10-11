import child_process from 'child_process'
import { Random } from 'meteor/random'
import util from 'util'

let lsp
const pendingMessages = {}
let incomingBuffer = ''
let publication

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
    receivedMessage()
  })
})

function sendMessage(message) {
  const str = JSON.stringify(message)
  const contentLength = str.length
  lsp.stdin.write(`Content-Length: ${contentLength}\r\n\r\n${str}`)
}

function receivedMessage() {
  while (incomingBuffer) {
    let m = incomingBuffer.match(/Content-Length: (\d+)\r\n\r\n/)
    if (!m) return
    const index = m[0].length
    const contentLength = +m[1]
    if (incomingBuffer.length < index + contentLength) return
    const message = incomingBuffer.slice(index, index + contentLength)
    incomingBuffer = incomingBuffer.slice(index + contentLength)

    try {
      const object = JSON.parse(message)
      console.log(util.inspect(object, { showHidden: false, depth: null }))
      const _id = Random.id()
      if (publication) publication.added('LSPMessages', _id, { message })
    } catch (e) {
      console.error(e)
      console.log({ pendingMessages, message })
    }
  }
}

Meteor.publish('LSPMessages', function () {
  publication = this
})

Meteor.methods({
  async sendLSPMessage(message) {
    console.log(
      this.userId,
      util.inspect(message, { showHidden: false, depth: null })
    )
    let promise
    if ('id' in message) {
      promise = new Promise(r => (pendingMessages[message.id] = r))
    }
    sendMessage(message)
    if ('id' in message) {
      return await promise
    }
  }
})
