import { check } from 'meteor/check'

export const Messages = new Meteor.Collection('Messages')

Meteor.methods({
  sendMessage({ text, student_id, from, task_id }) {
    //const from = this.userId === 'instructor' ? 'instructor' : 'student'
    check(student_id, String)
    check(task_id, String)
    check(from, String)
    check(text, String)
    Messages.insert({ text, student_id, from, createdAt: +new Date(), task_id })
  }
})

if (Meteor.isServer) {
  console.log('pu')
  Meteor.publish('MessagesOf', function ({ student_id, task_id }) {
    check(student_id, String)
    check(task_id, String)
    return Messages.find({ student_id, task_id })
  })
}
