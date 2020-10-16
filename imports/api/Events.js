export const Events = new Meteor.Collection('Events')

Meteor.methods({
  event({ student_id, task_id, type, value, code }) {
    Events.insert({
      student_id,
      task_id,
      createdAt: new Date(),
      type,
      value,
      code
    })
  }
})

if (Meteor.isServer) {
  Meteor.publish('EventsThat', function (query) {
    if (this.userId === 'instructor') {
      return Events.find(query, { sort: { createdAt: 1 } })
    }
    return []
  })
  Meteor.publish('Events', function (query) {
    if (this.userId === 'instructor') {
      console.log('instr')
      return Events.find()
    }
    console.log('not instr')
  })
}
