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
  Meteor.publish('Students_myself', function (student_id) {
    return Students.find({ _id: student_id })
  })
} else {
  Meteor.subscribe('Students')
}

Meteor.methods({
  editCode({ student_id, task_id, code }) {
    try {
      console.log(
        'editCode',
        [new Date().toISOString(), student_id || '', task_id || '', code || '']
          .map(JSON.stringify)
          .join(', ')
      )
    } catch {}
    Students.update(student_id, { $set: { code } })
  }
})
