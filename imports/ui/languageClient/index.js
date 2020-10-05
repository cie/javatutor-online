import {
  MonacoServices,
  createConnection,
  MonacoLanguageClient,
  ErrorAction,
  CloseAction
} from 'monaco-languageclient'
import { lspOverMethodsMessageConnection } from './lspOverMethods'

export default function setupLanguageClient(editor) {
  if (!Meteor.isClient) return

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
          lspOverMethodsMessageConnection(),
          console.error,
          console.warn
        )
      }
    }
  })
  const disposable = languageClient.start() // do not
  return () => disposable.dispose()
}
