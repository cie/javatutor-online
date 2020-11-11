import {
  MonacoServices,
  createConnection,
  MonacoLanguageClient,
  ErrorAction,
  CloseAction
} from 'monaco-languageclient'
import { lspOverMeteorMessageConnection } from './lspOverMeteor'

let installed = false

export default function setupLanguageClient(editor) {
  if (!Meteor.isClient) return
  if (installed) return
  installed = true

  MonacoServices.install(editor)

  const languageClient = new MonacoLanguageClient({
    name: 'JavaTutor Java client',
    clientOptions: {
      documentSelector: ['java'],
      errorHandler: {
        error: ErrorAction.Continue,
        closed: CloseAction.Restart
      }
    },
    connectionProvider: {
      async get() {
        return createConnection(
          lspOverMeteorMessageConnection(),
          console.error,
          console.warn
        )
      }
    }
  })
  const disposable = languageClient.start() // do not
  return () => disposable.dispose()
}
