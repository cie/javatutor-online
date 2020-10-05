export const Events = new Meteor.Collection('Events')

Meteor.methods({
  event({ student_id, task_id, type, value }) {
    Events.insert({
      student_id,
      task_id,
      createdAt: new Date(),
      type,
      value
    })
  }
})
