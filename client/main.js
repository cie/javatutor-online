import { Meteor } from 'meteor/meteor'
import '../imports/api'
import App from '../imports/ui/App.svelte'
import 'vscode'

window.addEventListener('unhandledrejection', e => {
  alert(e.reason.message || e.reason)
})

console.log('47')
Meteor.startup(() => {
  try {
    new App({ target: document.getElementById('app') })
  } catch (e) {
    alert(e.message || e)
  }
})
