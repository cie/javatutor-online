import { Meteor } from 'meteor/meteor'
import '../imports/api'
import './languageServer'
import './hints'
import './run'

Meteor.startup(() => {
  Meteor.users.upsert('instructor', { username: 'instructor' })
  Accounts.setPassword(
    'instructor',
    Meteor.settings.instructorPassword || 'thisisnotatest'
  )
})

const groups = ['experimental', 'control']
let group

console.log(21)
Meteor.methods({
  reauthenticate({ student_id }) {
    if (student_id === 'instructor') throw new Meteor.Error(403)
    this.setUserId(student_id)
  },
  startSession({ nickname, experiment_id }) {
    group = groups[groups.indexOf(group) + 1] || groups[0]
    const student_id = Students.insert({
      nickname,
      experiment_id,
      group
    })
    this.setUserId(student_id)
    return { student_id, group }
  }
})
