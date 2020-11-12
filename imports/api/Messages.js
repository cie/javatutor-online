import { check } from 'meteor/check'

export const Messages = new Meteor.Collection('Messages')

Meteor.methods({
  sendMessage({ text, student_id }) {
    const from = this.userId === 'instructor' ? 'instructor' : 'student'
    Messages.insert({ text, student_id, from, createdAt: +new Date() })
  }
})

if (Meteor.isServer) {
  console.log('pu')
  Meteor.publish('MessagesOf', function ({ student_id }) {
    check(student_id, String)
    return Messages.find({ student_id })
  })
}
