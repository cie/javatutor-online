export const Students = new Meteor.Collection('Students')

Students.allow({
  remove() {
    return Meteor.userId() === 'instructor'
  }
})

if (Meteor.isServer) {
  Meteor.publish('Students', function () {
    if (this.userId === 'instructor') return Students.find()
  })
} else {
  Meteor.subscribe('Students')
}
