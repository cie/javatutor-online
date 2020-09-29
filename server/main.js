import { Meteor } from 'meteor/meteor'
import '../imports/api'

Meteor.startup(() => {
  Meteor.users.upsert('instructor', { username: 'instructor' })
  Accounts.setPassword(
    'instructor',
    Meteor.settings.instructorPassword || 'thisisnotatest'
  )
})

Meteor.methods({
  startSession({ nickname, experiment_id }) {
    const student_id = Students.insert({
      nickname,
      experiment_id
    })
    this.setUserId(student_id)
    return student_id
  },
  rejoinSession({ student_id }) {
    this.setUserId(student_id)
  }
})

Meteor.methods({
  run(javaCode) {}
})
