import ServerStream from 'meteor/mmack:m-stream'

Meteor.methods({
  lsp(message) {
    console.log(this.userId, message)
  }
})
