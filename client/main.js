import { Meteor } from 'meteor/meteor'
import '../imports/api'
import App from '../imports/ui/App.svelte'
import 'vscode'

console.log('66')
Meteor.startup(() => {
  new App({ target: document.getElementById('app') })
})
