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
  startSession({ nickname }) {
    const _id = Students.insert({
      nickname
    })
    return _id
  }
})
